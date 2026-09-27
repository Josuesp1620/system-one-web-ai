"""El formato común de un mensaje: sirve para Bitext y para los mensajes reales de un cliente."""
from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class Message:
    id: str
    text: str
    labels: dict        # respuesta correcta por campo (por ejemplo, {"category": "REFUND", "intent": "get_refund"})
    source: str
    variations: str = ""   # en Bitext, las variaciones de lenguaje aplicadas (por ejemplo, Z = errores de tipeo)

    def to_record(self) -> dict:
        return asdict(self)

    @classmethod
    def from_record(cls, record: dict) -> "Message":
        return cls(record["id"], record["text"], record["labels"], record["source"], record.get("variations", ""))
