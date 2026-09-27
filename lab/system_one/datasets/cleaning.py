"""Limpieza de mensajes: descarta los que quedaron sin traducir (en inglés) y cuenta cuántos se descartaron."""
import re
from dataclasses import dataclass, field

from system_one.datasets.message import Message


@dataclass
class CleaningReport:
    kept: int = 0
    dropped_untranslated: int = 0
    examples_dropped: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {"kept": self.kept, "dropped_untranslated": self.dropped_untranslated, "examples_dropped": self.examples_dropped}


class LanguageFilter:
    """Distingue español de inglés contando palabras frecuentes de cada idioma (sin modelos externos).
    Un mensaje sin señales claras de inglés se conserva."""

    SPANISH_WORDS = {"el", "la", "los", "las", "de", "del", "que", "y", "en", "un", "una", "mi", "me", "por", "para", "con",
                     "no", "es", "se", "su", "lo", "al", "como", "quiero", "puedo", "necesito", "dónde", "cómo", "qué", "ayuda"}
    ENGLISH_WORDS = {"the", "to", "and", "my", "i", "you", "your", "is", "of", "for", "with", "can", "how", "what", "want",
                     "need", "help", "do", "an", "it", "on", "in", "where", "would", "please"}
    WORD_PATTERN = re.compile(r"[a-záéíóúñü]+")

    def words(self, text: str) -> list[str]:
        return self.WORD_PATTERN.findall(text.lower())

    def spanish_hits(self, text: str) -> int:
        return sum(word in self.SPANISH_WORDS for word in self.words(text))

    def english_hits(self, text: str) -> int:
        return sum(word in self.ENGLISH_WORDS for word in self.words(text))

    def is_spanish(self, text: str) -> bool:
        english = self.english_hits(text)
        return not (english >= 2 and english > self.spanish_hits(text))


class MessageCleaner:
    MAXIMUM_EXAMPLES = 10

    def __init__(self, language_filter: LanguageFilter | None = None):
        self.language_filter = language_filter or LanguageFilter()

    def clean(self, messages: list[Message]) -> tuple[list[Message], CleaningReport]:
        report = CleaningReport()
        kept = []
        for message in messages:
            if self.language_filter.is_spanish(message.text):
                kept.append(message)
                continue
            report.dropped_untranslated += 1
            if len(report.examples_dropped) < self.MAXIMUM_EXAMPLES:
                report.examples_dropped.append(message.text)
        report.kept = len(kept)
        return kept, report
