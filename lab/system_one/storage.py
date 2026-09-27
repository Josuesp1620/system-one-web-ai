"""Lectura y escritura de archivos JSON y JSONL."""
import json
from pathlib import Path


class JsonStore:
    def __init__(self, compact: bool = True):
        self.compact = compact

    def save(self, path: Path, content: dict | list) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        options = {"separators": (",", ":")} if self.compact else {"indent": 2}
        path.write_text(json.dumps(content, ensure_ascii=False, **options))

    def load(self, path: Path) -> dict | list:
        return json.loads(path.read_text())

    def save_lines(self, path: Path, records: list[dict]) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("".join(json.dumps(record, ensure_ascii=False) + "\n" for record in records))

    def load_lines(self, path: Path) -> list[dict]:
        return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]
