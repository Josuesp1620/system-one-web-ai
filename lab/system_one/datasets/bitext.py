"""Bitext de atención al cliente, versión en español (CDLA-Sharing-1.0): 24.184 mensajes, 11 categorías, 27 intenciones.
Es sintético (generado y traducido), no son mensajes de clientes reales. Cada mensaje trae en `flags` las variaciones de
lenguaje que se le aplicaron a propósito; por ejemplo Z = errores de tipeo, Q = coloquial, W = lenguaje ofensivo."""
from system_one.datasets.message import Message


class BitextDataset:
    REPOSITORY = "Faramir/Bitext-customer-support-llm-chatbot-training-dataset-spanish"
    SOURCE = "bitext-es"
    LICENSE = "CDLA-Sharing-1.0"

    def load(self) -> list[Message]:
        from datasets import load_dataset
        rows = load_dataset(self.REPOSITORY)["train"]
        return [
            Message(id=f"{self.SOURCE}-{index}", text=row["instruction"].strip(),
                    labels={"category": row["category"], "intent": row["intent"]}, source=self.SOURCE, variations=row["flags"])
            for index, row in enumerate(rows)
        ]
