"""Paso 2 · Preparar los datos: cargar, limpiar, dividir en entrenamiento y prueba, y guardar con un informe."""
from collections import Counter
from pathlib import Path

from system_one.datasets.bitext import BitextDataset
from system_one.datasets.cleaning import MessageCleaner
from system_one.datasets.message import Message
from system_one.datasets.splitting import StratifiedSplitter
from system_one.settings import SamplingSettings
from system_one.storage import JsonStore


class DataPreparation:
    def __init__(self, output: Path, sampling: SamplingSettings, dataset: BitextDataset | None = None, cleaner: MessageCleaner | None = None):
        self.output = output
        self.sampling = sampling
        self.dataset = dataset or BitextDataset()
        self.cleaner = cleaner or MessageCleaner()
        self.store = JsonStore(compact=False)

    def run(self) -> dict:
        messages = self.dataset.load()
        clean, cleaning = self.cleaner.clean(messages)
        split = StratifiedSplitter(self.sampling.test_per_intent, self.sampling.seed).split(clean)
        self.store.save_lines(self.output / "train.jsonl", [message.to_record() for message in split.train])
        self.store.save_lines(self.output / "test.jsonl", [message.to_record() for message in split.test])
        report = {
            "source": {"repository": self.dataset.REPOSITORY, "license": self.dataset.LICENSE, "synthetic": True},
            "loaded": len(messages), "cleaning": cleaning.to_dict(),
            "train": len(split.train), "test": len(split.test),
            "test_per_intent": self.sampling.test_per_intent, "seed": self.sampling.seed,
            "test_by_category": dict(Counter(message.labels["category"] for message in split.test).most_common()),
        }
        self.store.save(self.output / "report.json", report)
        return report

    def load_split(self, name: str) -> list[Message]:
        return [Message.from_record(record) for record in self.store.load_lines(self.output / f"{name}.jsonl")]
