"""La interfaz común de los modelos System One: mensajes + decisiones → predicciones, midiendo el tiempo."""
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass

from system_one.datasets.message import Message
from system_one.models.prediction import AnswerParser, Prediction
from system_one.tasks.decision import Decision


@dataclass(frozen=True)
class BatchResult:
    predictions: list[Prediction]
    seconds: float
    messages: int

    @property
    def milliseconds_per_message(self) -> float:
        return 1000 * self.seconds / max(1, self.messages)


class DecisionModel(ABC):
    name: str
    device: str

    def __init__(self):
        self.parser = AnswerParser()

    def predict(self, messages: list[Message], decisions: list[Decision]) -> BatchResult:
        questions = {decision.id: decision.api_question() for decision in decisions}
        self.warm_up(messages[0].text, questions)
        start = time.perf_counter()
        answers = self.answer_batch([message.text for message in messages], questions)
        seconds = time.perf_counter() - start
        predictions = [
            Prediction(message.id, decision.id, self.parser.probabilities(decision, message_answers[decision.id]))
            for message, message_answers in zip(messages, answers) for decision in decisions
        ]
        return BatchResult(predictions, seconds, len(messages))

    def warm_up(self, text: str, questions: dict) -> None:
        """Una primera pasada que no se mide (carga y compila lo necesario)."""
        self.answer_batch([text], questions)

    @abstractmethod
    def answer_batch(self, texts: list[str], questions: dict) -> list[dict]:
        """Por cada texto, las respuestas en formato de la API System One: {decisión: respuesta}."""
