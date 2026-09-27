# lab · el proceso en código

Paquete Python `system_one`: cada paso del [proceso de implementación](../docs/implementacion.md) es un comando.
El código está en inglés; los comentarios y la documentación, en español.

```
system_one/
├── cli.py            un comando por paso (python -m system_one --help)
├── settings.py       rutas y parámetros (tamaño y semilla de la prueba)
├── storage.py        lectura y escritura de JSON y JSONL
├── datasets/         paso 2: Bitext, limpieza, división en entrenamiento y prueba, formato común de mensaje
├── tasks/            paso 1: las decisiones (pregunta, alternativas, respuesta correcta)
├── models/           Laya y Kev con la misma interfaz (mensajes + decisiones → predicciones)
├── evaluation/       paso 3: acierto, matriz de confusión, calibración, curva de automatización
├── inspection/       Laya paso a paso (lo que muestra la web «por dentro»), verificado contra Laya
└── export/           los JSON que carga la web (web/public/data)
```

## Instalar y correr

Con [uv](https://docs.astral.sh/uv/) (Python 3.12 o 3.13):

```bash
uv sync                                   # torch para CPU, Laya (PyPI) y Kev (desde su repositorio)
uv run python -m system_one prepare       # paso 2
uv run python -m system_one evaluate laya # paso 3 en CPU (--limit 54 para una prueba rápida)
uv run python -m system_one export        # datos de la web
```

En el servidor de desarrollo no se instala nada: `./lab.sh` corre lo mismo dentro de Docker
(`./lab.sh uv sync`, `./lab.sh python -m system_one prepare`).

## Datos

- `data/prepared/test.jsonl` y `report.json` se versionan: son la prueba exacta con la que se midió todo.
  `train.jsonl` no (4 MB); `prepare` lo vuelve a generar igual (semilla fija).
- `data/evaluations/` guarda cada medición completa, con las respuestas del modelo mensaje por mensaje.
- Bitext en español: [Faramir/Bitext-customer-support-llm-chatbot-training-dataset-spanish](https://huggingface.co/datasets/Faramir/Bitext-customer-support-llm-chatbot-training-dataset-spanish),
  licencia CDLA-Sharing-1.0, **sintético** (generado y traducido).
