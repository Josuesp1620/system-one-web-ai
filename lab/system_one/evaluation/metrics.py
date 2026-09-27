"""Métricas de una decisión, a partir de pares (predicción, respuesta correcta)."""
from dataclasses import dataclass

from system_one.models.prediction import Prediction


@dataclass(frozen=True)
class ScoredPrediction:
    prediction: Prediction
    correct_key: str

    @property
    def is_correct(self) -> bool:
        return self.prediction.predicted == self.correct_key


class DecisionMetrics:
    CALIBRATION_BINS = 10
    COVERAGE_THRESHOLDS = [round(0.5 + step * 0.05, 2) for step in range(10)] + [0.99]

    def __init__(self, scored: list[ScoredPrediction], keys: list[str]):
        self.scored = scored
        self.keys = keys

    def accuracy(self) -> float:
        return sum(item.is_correct for item in self.scored) / len(self.scored)

    def confusion_matrix(self) -> list[list[int]]:
        """Filas: respuesta correcta; columnas: lo que respondió el modelo (en el orden de `keys`)."""
        position = {key: index for index, key in enumerate(self.keys)}
        matrix = [[0] * len(self.keys) for key in self.keys]
        for item in self.scored:
            matrix[position[item.correct_key]][position[item.prediction.predicted]] += 1
        return matrix

    def brier_score(self) -> float:
        """Error cuadrático de toda la distribución (0 = perfecto). Castiga la seguridad equivocada."""
        total = 0.0
        for item in self.scored:
            total += sum((probability - (1.0 if key == item.correct_key else 0.0)) ** 2 for key, probability in item.prediction.probabilities.items())
        return total / len(self.scored)

    def calibration(self) -> list[dict]:
        """Por tramo de seguridad: cuántas respuestas, seguridad promedio y acierto real. Si está bien calibrado, coinciden."""
        bins = []
        for index in range(self.CALIBRATION_BINS):
            lower, upper = index / self.CALIBRATION_BINS, (index + 1) / self.CALIBRATION_BINS
            members = [item for item in self.scored if lower <= item.prediction.confidence < upper or (upper == 1.0 and item.prediction.confidence == 1.0)]
            if members:
                bins.append({"from": lower, "to": upper, "count": len(members),
                             "mean_confidence": sum(item.prediction.confidence for item in members) / len(members),
                             "accuracy": sum(item.is_correct for item in members) / len(members)})
        return bins

    def expected_calibration_error(self) -> float:
        return sum(abs(item["mean_confidence"] - item["accuracy"]) * item["count"] for item in self.calibration()) / len(self.scored)

    def coverage_curve(self) -> list[dict]:
        """Si se automatiza solo lo que supera el umbral: qué parte de los mensajes se cubre y con cuánto acierto."""
        curve = []
        for threshold in self.COVERAGE_THRESHOLDS:
            covered = [item for item in self.scored if item.prediction.confidence >= threshold]
            curve.append({"threshold": threshold, "coverage": len(covered) / len(self.scored),
                          "accuracy": (sum(item.is_correct for item in covered) / len(covered)) if covered else None})
        return curve

    def precision_recall(self, positive_key: str) -> dict:
        true_positive = sum(item.prediction.predicted == positive_key and item.correct_key == positive_key for item in self.scored)
        predicted_positive = sum(item.prediction.predicted == positive_key for item in self.scored)
        actual_positive = sum(item.correct_key == positive_key for item in self.scored)
        return {"precision": true_positive / predicted_positive if predicted_positive else None,
                "recall": true_positive / actual_positive if actual_positive else None,
                "actual_positive": actual_positive}

    def summary(self) -> dict:
        return {"accuracy": self.accuracy(), "brier_score": self.brier_score(),
                "expected_calibration_error": self.expected_calibration_error(), "calibration": self.calibration(),
                "coverage_curve": self.coverage_curve(), "confusion_matrix": self.confusion_matrix(), "keys": self.keys}
