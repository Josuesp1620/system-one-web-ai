"""Inspector de Laya: repite paso a paso el cálculo de su red para leer lo que pasa dentro (tokens, atención, vectores
de los marcadores, logits, temperatura, softmax, cabeza de acción) y comprueba que da las mismas probabilidades que
Laya. Si no coinciden, lanza un error: la web solo muestra datos reales."""
from dataclasses import dataclass

import numpy
import torch
from laya.common import QTYPES, temp_bucket

from system_one.inspection.importance import WordImportance
from system_one.inspection.rows import RowBuilder
from system_one.inspection.token_roles import TokenRoles
from system_one.tasks.decision import Decision


class MismatchWithLaya(AssertionError):
    """El cálculo paso a paso no reproduce la respuesta oficial de Laya."""


@dataclass
class ForwardTrace:
    """Lo que devuelve el cálculo paso a paso, para todas las filas (una por pregunta) de un mensaje."""
    attentions: tuple        # por capa: [filas, cabezas, largo, largo]
    vectors: torch.Tensor    # [filas, opciones, dimensión]
    logits: torch.Tensor     # [filas, opciones]
    features: torch.Tensor   # [filas, 4]: probabilidad más alta, margen, entropía, opciones/255
    action: torch.Tensor     # [filas, 2]


@dataclass(frozen=True)
class Rounding:
    """Cuántos decimales se guardan de cada cosa (define el tamaño de los JSON de la web)."""
    default: int = 4
    vectors: int = 3

    def values(self, numbers, decimals: int | None = None) -> list[float]:
        return [round(float(number), self.default if decimals is None else decimals) for number in numbers]


class LayaInspector:
    LOGIT_TOLERANCE = 1e-4
    PROBABILITY_TOLERANCE = 1e-3

    def __init__(self, checkpoint: str = "multilingual", language: str = "es"):
        import laya
        self.language = language
        self.rounding = Rounding()
        self.agent = laya.load("convaiinnovations/laya", subfolder=checkpoint, device="cpu")
        self.network, self.tokenizer = self.agent.model, self.agent.tok
        self.network.encoder.set_attn_implementation("eager")      # la atención "eager" es la única que devuelve sus pesos
        self.row_builder = RowBuilder(self.tokenizer, self.agent.cfg)
        self.token_roles = TokenRoles(self.tokenizer.sep_token_id)
        self.word_importance = WordImportance(self.agent, language)
        configuration = self.network.encoder.config
        self.layers = configuration.num_hidden_layers
        self.global_layers = [layer for layer in range(self.layers) if layer % configuration.global_attn_every_n_layers == 0]

    def model_card(self) -> dict:
        configuration = self.network.encoder.config
        return {
            "name": "Laya multilingüe", "repository": "convaiinnovations/laya (multilingual)", "license": "Apache-2.0",
            "encoder": self.agent.cfg["encoder"], "layers": self.layers, "global_layers": self.global_layers,
            "local_window": configuration.local_attention, "heads": configuration.num_attention_heads,
            "dimensions": configuration.hidden_size, "vocabulary": configuration.vocab_size,
            "head_layers": self.agent.cfg["head_layers"], "temperatures": self.agent.temperature,
            "training": self.agent.cfg.get("training"),
            "parameters": sum(parameter.numel() for parameter in self.network.parameters()),
        }

    def inspect(self, text: str, decisions: list[Decision]) -> dict:
        api_questions = {decision.id: decision.api_question() for decision in decisions}
        rows = self.row_builder.build(text, api_questions)
        batch = self.row_builder.batch(rows)
        official = self.agent.system_one(text, api_questions, lang=self.language)
        trace = self.trace(batch)
        self.verify_logits(batch, trace)
        described = [self.describe_row(row_index, decision, rows[row_index], official["answers"][decision.id], trace)
                     for row_index, decision in enumerate(decisions)]
        winners = {item["decision"]["id"]: int(numpy.argmax(item["probabilities"])) for item in described}
        importance = self.word_importance.measure(text, api_questions, winners)
        for item in described:
            item["importance"] = importance[item["decision"]["id"]]
        return {"text": text, "tokens_total": sum(len(row["ids"]) for row in rows), "decisions": described}

    @torch.no_grad()
    def trace(self, batch: dict) -> ForwardTrace:
        network = self.network
        output = network.encoder(input_ids=batch["input_ids"], attention_mask=batch["attention_mask"], output_attentions=True)
        hidden = output.last_hidden_state + network.type_emb(batch["qtype"])[:, None, :]
        padding = ~batch["attention_mask"].bool()
        for layer in network.head.layers:
            hidden = layer(hidden, src_key_padding_mask=padding)
        positions = batch["marker_pos"].clamp(min=0)[:, :, None].expand(-1, -1, hidden.size(-1))
        vectors = torch.gather(hidden, 1, positions)
        logits = network.scorer(vectors).squeeze(-1).float().masked_fill(~batch["marker_mask"], -1e4)
        probabilities = torch.softmax(logits, -1)
        option_count = batch["marker_mask"].sum(-1).clamp(min=2).float()
        entropy = -(probabilities * torch.log(probabilities.clamp_min(1e-9))).sum(-1) / torch.log(option_count)
        best_two = probabilities.topk(2, -1).values
        features = torch.stack([best_two[:, 0], best_two[:, 0] - best_two[:, 1], entropy, option_count / 255.0], -1)
        action = torch.softmax(network.act_head(torch.cat([hidden[:, 0].float(), features], -1)).float(), -1)
        return ForwardTrace(output.attentions, vectors, logits, features, action)

    @torch.no_grad()
    def verify_logits(self, batch: dict, trace: ForwardTrace) -> None:
        official = self.network(batch["input_ids"], batch["attention_mask"], batch["marker_pos"], batch["marker_mask"], batch["qtype"])[0]
        if not torch.allclose(trace.logits, official.float(), atol=self.LOGIT_TOLERANCE):
            raise MismatchWithLaya("el cálculo paso a paso no coincide con el del modelo")

    def temperature(self, kind: str, option_count: int) -> float:
        code = QTYPES[kind]
        return self.agent.temperature_by_options.get(temp_bucket(code, option_count), self.agent.temperature[code])

    def softmax(self, logits: numpy.ndarray, temperature: float) -> numpy.ndarray:
        scaled = logits / temperature
        exponentials = numpy.exp(scaled - scaled.max())
        return exponentials / exponentials.sum()

    def describe_row(self, row_index: int, decision: Decision, row: dict, official: dict, trace: ForwardTrace) -> dict:
        length, markers = len(row["ids"]), row["markers"]
        temperature = self.temperature(row["kind"], len(markers))
        logits = trace.logits[row_index, :len(markers)].numpy()
        probabilities = self.softmax(logits, temperature)
        expected = list(official["probabilities"].values()) if "probabilities" in official else [1 - official["noul"], official["noul"]]
        if not numpy.allclose(probabilities, expected, atol=self.PROBABILITY_TOLERANCE):
            raise MismatchWithLaya(f"{decision.id}: probabilidades distintas a las de Laya")
        roles, option_of_token = self.token_roles.classify(row["ids"], markers)
        message_positions = [position for position, role in enumerate(roles) if role == "message"]
        attention_by_layer = torch.stack([attention[row_index, :, :, :length].mean(0) for attention in trace.attentions])   # promedio de cabezas
        rounding = self.rounding
        return {
            "decision": decision.describe(),
            "tokens": [{"text": piece, "role": role, "option": option}
                       for piece, role, option in zip(self.tokenizer.convert_ids_to_tokens(row["ids"]), roles, option_of_token)],
            "markers": markers,
            "attention": {
                "global_average": [rounding.values(attention_by_layer[self.global_layers][:, marker].mean(0)[message_positions]) for marker in markers],
                "to_message_by_layer": [rounding.values(attention_by_layer[:, marker][:, message_positions].sum(-1)) for marker in markers],
                "message_by_layer": [[rounding.values(attention_by_layer[layer, marker, message_positions]) for layer in range(self.layers)] for marker in markers],
            },
            "vectors": [rounding.values(vector, rounding.vectors) for vector in trace.vectors[row_index, :len(markers)]],
            "logits": rounding.values(logits), "temperature": temperature, "probabilities": rounding.values(probabilities),
            "action": {"features": dict(zip(["top_probability", "margin", "entropy", "options_over_255"], rounding.values(trace.features[row_index]))),
                       "act_probability": round(float(trace.action[row_index, 0]), rounding.default)},
        }
