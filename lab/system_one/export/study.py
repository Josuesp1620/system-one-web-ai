"""El caso de estudio de la web: resume cada medición (métricas, calibración, cobertura y velocidad) y elige
ejemplos reales de aciertos y errores con mucha seguridad."""
from pathlib import Path

from system_one.datasets.message import Message
from system_one.export.showcase import ShowcaseSelector
from system_one.storage import JsonStore


class StudySummarizer:
    SUMMARY_FIELDS = ("accuracy", "brier_score", "expected_calibration_error", "calibration", "coverage_curve",
                      "confusion_matrix", "keys", "positive_class", "decision")

    def summarize(self, report: dict) -> dict:
        return {
            "model": report["model"], "device": report["device"], "environment": report["environment"],
            "messages": report["messages"], "milliseconds_per_message": report["milliseconds_per_message"],
            "decisions": {decision_id: {field: summary[field] for field in self.SUMMARY_FIELDS if field in summary}
                          for decision_id, summary in report["decisions"].items()},
        }


class ExamplePicker:
    """Ejemplos para la web: los aciertos y los errores con más seguridad de una decisión, solo entre mensajes que se
    leen bien (mismo criterio que la vitrina: sin variables {{…}} ni números largos pegados)."""

    def __init__(self, per_group: int = 4, selector: ShowcaseSelector | None = None):
        self.per_group = per_group
        self.selector = selector or ShowcaseSelector()

    def pick(self, report: dict, messages: dict[str, Message], decision_id: str, correct_field: str) -> dict:
        predictions = [prediction for prediction in report["predictions"] if prediction["decision_id"] == decision_id]
        described = [self.describe(prediction, messages[prediction["message_id"]], correct_field) for prediction in predictions
                     if self.selector.is_readable(messages[prediction["message_id"]])]
        described.sort(key=lambda example: example["confidence"], reverse=True)
        return {"right": [example for example in described if example["is_correct"]][: self.per_group],
                "wrong": [example for example in described if not example["is_correct"]][: self.per_group]}

    def describe(self, prediction: dict, message: Message, correct_field: str) -> dict:
        probabilities = prediction["probabilities"]
        predicted = max(probabilities, key=probabilities.get)
        correct = message.labels[correct_field]
        return {"message_id": message.id, "text": message.text, "predicted": predicted, "correct": correct,
                "confidence": probabilities[predicted], "is_correct": predicted == correct}


class StudyExporter:
    def __init__(self, evaluations: Path, prepared_report: Path, output: Path, summarizer: StudySummarizer | None = None, picker: ExamplePicker | None = None):
        self.evaluations = evaluations
        self.prepared_report = prepared_report
        self.output = output
        self.summarizer = summarizer or StudySummarizer()
        self.picker = picker or ExamplePicker()
        self.store = JsonStore()

    def export(self, test_messages: list[Message], examples_from: str) -> None:
        reports = {path.stem: self.store.load(path) for path in sorted(self.evaluations.glob("*.json")) if "sample" not in path.stem}
        messages = {message.id: message for message in test_messages}
        source = reports[examples_from]
        self.store.save(self.output / "study.json", {
            "dataset": self.store.load(self.prepared_report),
            "runs": {name: self.summarizer.summarize(report) for name, report in reports.items()},
            "examples": {"run": examples_from, "area": self.picker.pick(source, messages, "area", "category"),
                         "intent": self.picker.pick(source, messages, "intent", "intent")},
        })
