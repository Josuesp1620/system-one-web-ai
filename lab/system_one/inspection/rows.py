"""Arma las filas que Laya procesa (una por pregunta) con su API pública, igual que Laya por dentro:
<bos> tipo + pregunta <eos> <mask> opción A <mask> opción B … <eos> mensaje <eos>."""
from laya.common import QTYPES, build_sequence, collate_items


class RowBuilder:
    def __init__(self, tokenizer, configuration: dict):
        self.tokenizer = tokenizer
        self.maximum_length = configuration.get("max_len", 512)
        self.maximum_header_length = configuration.get("head_max_len", 192)

    def laya_question(self, api_question: dict) -> dict:
        """Una pregunta de la API System One en el formato interno de Laya (tipo, instrucción, criterios)."""
        return {"t": api_question["type"], "ins": api_question["instructions"], "crit": api_question.get("criteria")}

    def build(self, text: str, api_questions: dict) -> list[dict]:
        rows = []
        for api_question in api_questions.values():
            question = self.laya_question(api_question)
            token_ids, markers = build_sequence(self.tokenizer, text, question, self.maximum_length, self.maximum_header_length)
            rows.append({"ids": token_ids, "markers": markers, "qtype": QTYPES[question["t"]], "kind": question["t"]})
        return rows

    def batch(self, rows: list[dict]) -> dict:
        """Las filas juntas, con relleno, listas para una sola pasada por el modelo."""
        return collate_items([rows], self.tokenizer.pad_token_id)
