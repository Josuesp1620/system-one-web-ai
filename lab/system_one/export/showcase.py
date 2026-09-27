"""Los mensajes que el visitante puede elegir en la web: uno por área (el primer mensaje presentable del conjunto de
prueba, que ya viene barajado con semilla fija), cada uno inspeccionado paso a paso en Laya."""
import re
from pathlib import Path

from system_one.datasets.cleaning import LanguageFilter
from system_one.datasets.message import Message
from system_one.inspection.inspector import LayaInspector
from system_one.storage import JsonStore
from system_one.tasks.decision import Decision


class ShowcaseSelector:
    """Elige, por área, el mensaje más largo que se lee bien: sin variables sin reemplazar ({{…}}), sin números largos
    pegados, con señales claras de español y sin palabras repetidas una y otra vez (Bitext genera algunos así).
    No cambia ningún dato; solo decide cuál se muestra."""

    MINIMUM_LENGTH = 45
    FALLBACK_MINIMUM_LENGTH = 25       # para las áreas sin ningún mensaje legible de al menos MINIMUM_LENGTH
    MAXIMUM_LENGTH = 110
    MINIMUM_SPANISH_WORDS = 3
    MAXIMUM_WORD_REPEATS = 1
    EXCLUDED_VARIATIONS = set("ZW")     # Bitext: Z = errores de tipeo a propósito, W = lenguaje ofensivo
    LONG_NUMBER = re.compile(r"\d{5,}")

    def __init__(self, language_filter: LanguageFilter | None = None):
        self.language_filter = language_filter or LanguageFilter()

    def is_readable(self, message: Message, minimum_length: int | None = None) -> bool:
        return not (set(message.variations) & self.EXCLUDED_VARIATIONS) and self.is_presentable(message.text, minimum_length)

    def is_presentable(self, text: str, minimum_length: int | None = None) -> bool:
        return ("{{" not in text and not self.LONG_NUMBER.search(text)
                and (minimum_length or self.MINIMUM_LENGTH) <= len(text) <= self.MAXIMUM_LENGTH
                and self.language_filter.spanish_hits(text) >= self.MINIMUM_SPANISH_WORDS
                and not self.repeats_words(text))

    def repeats_words(self, text: str) -> bool:
        content_words = [word for word in self.language_filter.words(text) if word not in self.language_filter.SPANISH_WORDS and len(word) > 3]
        return any(content_words.count(word) > self.MAXIMUM_WORD_REPEATS for word in set(content_words))

    def select(self, messages: list[Message], group_field: str = "category") -> list[Message]:
        best = self.longest_by_group(messages, group_field, self.MINIMUM_LENGTH)
        fallback = self.longest_by_group(messages, group_field, self.FALLBACK_MINIMUM_LENGTH)
        return [best.get(group, fallback[group]) for group in sorted(fallback)]

    def longest_by_group(self, messages: list[Message], group_field: str, minimum_length: int) -> dict[str, Message]:
        best: dict[str, Message] = {}
        for message in messages:
            if not self.is_readable(message, minimum_length):
                continue
            group = message.labels[group_field]
            if group not in best or len(message.text) > len(best[group].text):
                best[group] = message
        return best


class ShowcaseExporter:
    def __init__(self, inspector: LayaInspector, decisions: list[Decision], output: Path):
        self.inspector = inspector
        self.decisions = decisions
        self.output = output
        self.store = JsonStore()

    def export(self, messages: list[Message]) -> None:
        index = []
        for message in messages:
            inspection = self.inspector.inspect(message.text, self.decisions)
            inspection["correct"] = {decision.id: decision.correct_answer(message) for decision in self.decisions}
            self.store.save(self.output / f"{message.id}.json", inspection)
            index.append({"id": message.id, "text": message.text, "correct": inspection["correct"]})
            print(f"{message.id}: verificado · {message.text[:60]}", flush=True)
        self.store.save(self.output / "index.json", index)
