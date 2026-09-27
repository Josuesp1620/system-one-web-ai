"""Paso 3 · Medir: corre un modelo sobre el conjunto de prueba y compara cada respuesta con la correcta."""
import platform
from dataclasses import dataclass, field
from datetime import datetime, timezone

from system_one.datasets.message import Message
from system_one.evaluation.metrics import DecisionMetrics, ScoredPrediction
from system_one.models.base import DecisionModel
from system_one.tasks.decision import Decision


@dataclass
class EvaluationReport:
    model: str
    device: str
    environment: dict
    messages: int
    milliseconds_per_message: float
    decisions: dict = field(default_factory=dict)
    predictions: list[dict] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {"model": self.model, "device": self.device, "environment": self.environment, "messages": self.messages,
                "milliseconds_per_message": self.milliseconds_per_message, "decisions": self.decisions, "predictions": self.predictions}


class Evaluator:
    def __init__(self, model: DecisionModel, decisions: list[Decision], environment: dict | None = None):
        self.model = model
        self.decisions = decisions
        self.environment = environment or {"machine": platform.machine(), "platform": platform.platform()}

    def run(self, messages: list[Message]) -> EvaluationReport:
        result = self.model.predict(messages, self.decisions)
        message_by_id = {message.id: message for message in messages}
        report = EvaluationReport(self.model.name, self.model.device,
                                  {**self.environment, "finished_at": datetime.now(timezone.utc).isoformat(timespec="seconds")},
                                  len(messages), result.milliseconds_per_message,
                                  predictions=[prediction.to_record() for prediction in result.predictions])
        for decision in self.decisions:
            scored = [ScoredPrediction(prediction, decision.correct_answer(message_by_id[prediction.message_id]))
                      for prediction in result.predictions if prediction.decision_id == decision.id]
            metrics = DecisionMetrics(scored, decision.keys())
            summary = {"decision": decision.describe(), **metrics.summary()}
            if decision.kind == "noul":
                summary["positive_class"] = metrics.precision_recall("true")
            report.decisions[decision.id] = summary
        return report
