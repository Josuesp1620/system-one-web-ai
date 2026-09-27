"""Una decisión que se quiere automatizar: la pregunta, sus alternativas y de dónde sale la respuesta correcta.

Cada alternativa tiene una clave interna (en inglés, la de los datos) y un texto en español, que es lo único que lee el
modelo. Las respuestas del modelo vuelven con el texto y se traducen de nuevo a la clave."""
from dataclasses import dataclass
from typing import Callable, Literal

from system_one.datasets.message import Message


@dataclass(frozen=True)
class Option:
    key: str
    label: str
    description: str = ""


@dataclass(frozen=True)
class Decision:
    id: str
    question: str
    kind: Literal["choice", "noul"]
    options: tuple[Option, ...]
    correct_answer: Callable[[Message], str]    # la clave correcta para un mensaje

    def api_question(self) -> dict:
        """La pregunta en el formato de la API System One, que aceptan Laya y Kev."""
        if self.kind == "noul":
            return {"type": "noul", "instructions": self.question}
        return {"type": "choice", "instructions": self.question,
                "criteria": {option.label: (option.description or None) for option in self.options}}

    def keys(self) -> list[str]:
        return [option.key for option in self.options]

    def key_for_label(self, label: str) -> str:
        """La clave interna de la alternativa que el modelo devolvió por su texto."""
        return next(option.key for option in self.options if option.label == label)

    def describe(self) -> dict:
        return {"id": self.id, "question": self.question, "kind": self.kind,
                "options": [{"key": option.key, "label": option.label, "description": option.description} for option in self.options]}
