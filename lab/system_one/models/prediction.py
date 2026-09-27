"""La respuesta de un modelo a una decisión sobre un mensaje, ya con claves internas."""
from dataclasses import asdict, dataclass

from system_one.tasks.decision import Decision


@dataclass(frozen=True)
class Prediction:
    message_id: str
    decision_id: str
    probabilities: dict[str, float]     # clave interna → probabilidad

    @property
    def predicted(self) -> str:
        return max(self.probabilities, key=self.probabilities.get)

    @property
    def confidence(self) -> float:
        return max(self.probabilities.values())

    def to_record(self) -> dict:
        return asdict(self)

    @classmethod
    def from_record(cls, record: dict) -> "Prediction":
        return cls(record["message_id"], record["decision_id"], record["probabilities"])


class AnswerParser:
    """Convierte una respuesta de la API System One (la de Laya y Kev) en probabilidades por clave interna."""

    def probabilities(self, decision: Decision, answer: dict) -> dict[str, float]:
        if decision.kind == "noul":
            probability_true = float(answer["noul"])
            return {"false": 1.0 - probability_true, "true": probability_true}
        return {decision.key_for_label(label): float(value) for label, value in answer["probabilities"].items()}
