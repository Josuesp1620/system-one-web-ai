"""División en prueba y entrenamiento: la prueba tiene la misma cantidad de mensajes por intención (así todas las
intenciones pesan igual en la medición); el resto queda para el ajuste fino."""
import random
from collections import defaultdict
from dataclasses import dataclass

from system_one.datasets.message import Message


@dataclass(frozen=True)
class DatasetSplit:
    train: list[Message]
    test: list[Message]


class StratifiedSplitter:
    def __init__(self, test_per_group: int, seed: int, group_field: str = "intent"):
        self.test_per_group = test_per_group
        self.seed = seed
        self.group_field = group_field

    def split(self, messages: list[Message]) -> DatasetSplit:
        groups = defaultdict(list)
        for message in messages:
            groups[message.labels[self.group_field]].append(message)
        generator = random.Random(self.seed)
        train, test = [], []
        for group_name in sorted(groups):
            members = groups[group_name][:]
            generator.shuffle(members)
            test.extend(members[:self.test_per_group])
            train.extend(members[self.test_per_group:])
        return DatasetSplit(train=train, test=test)


class EvenSampler:
    """Una muestra chica repartida por todo el conjunto (el conjunto de prueba viene ordenado por intención, así que
    tomar los primeros N daría solo una o dos intenciones)."""

    def take(self, messages: list[Message], limit: int | None) -> list[Message]:
        if not limit or limit >= len(messages):
            return messages
        step = len(messages) / limit
        return [messages[int(position * step)] for position in range(limit)]
