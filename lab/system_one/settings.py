"""Rutas y parámetros del proyecto."""
from dataclasses import dataclass, field
from pathlib import Path


@dataclass(frozen=True)
class Paths:
    lab: Path = field(default_factory=lambda: Path(__file__).resolve().parents[1])

    @property
    def data(self) -> Path:
        """Datos generados por el laboratorio (se versionan: son pequeños y respaldan las cifras de la web)."""
        return self.lab / "data"

    @property
    def prepared(self) -> Path:
        """Mensajes ya limpios y divididos en entrenamiento y prueba."""
        return self.data / "prepared"

    @property
    def evaluations(self) -> Path:
        """Resultados de cada medición (un archivo por modelo y entorno)."""
        return self.data / "evaluations"

    @property
    def web_data(self) -> Path:
        """Los JSON que carga la web (web/public/data)."""
        return self.lab.parent / "web" / "public" / "data"


@dataclass(frozen=True)
class SamplingSettings:
    """Cómo se arma el conjunto de prueba: la misma cantidad de mensajes por intención, con semilla fija."""
    test_per_intent: int = 20
    seed: int = 20260927
