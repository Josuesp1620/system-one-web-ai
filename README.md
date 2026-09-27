# system-one-web-ai · Cómo decide una IA sin escribir

Autores: **Josue Salazar ([GitHub Josuesp1620](https://github.com/Josuesp1620) · [LinkedIn](https://www.linkedin.com/in/joucode))** · **[API SERVICE SAC](https://apiservicesac.com)**.

Un modelo **System One** no escribe una respuesta palabra por palabra como ChatGPT: recibe un mensaje y preguntas con
alternativas y devuelve **probabilidades**, en una sola pasada. Este repositorio:

1. **Mide** uno de ellos, [Laya](https://github.com/NandhaKishorM/laya) (abierto, Apache 2.0), en **540 mensajes de
   atención al cliente en español** con su respuesta correcta, todo en CPU, sin GPU.
2. **Lo abre por dentro** en una web interactiva: filas de tokens, atención de sus 22 capas, puntos → porcentajes y el
   umbral para decidir qué se automatiza.
3. **Deja el proceso listo para un cliente**: definir decisiones → preparar datos → medir → ajustar → calibrar →
   desplegar → monitorear ([docs/implementacion.md](docs/implementacion.md)).

## Resultados (540 mensajes de prueba)

| Modelo y equipo | Área (11) | Intención (27) | ¿Reclamo? (sí/no) | ms por mensaje |
|---|---|---|---|---|
| Laya multilingüe · CPU, sin GPU | 78,0 % | 78,0 % | 91,7 % | 316 |

- **Automatizar con umbral** (área): con al menos 90 % de seguridad, de cada 100 mensajes 66 se resuelven bien solos,
  6 con error y 28 pasan a una persona.
- **Reclamos**: los detecta todos (recall 100 %), pero solo el 31 % de lo que marca como reclamo lo es.
- **Estar seguro no es acertar**: por eso, antes de automatizar, el modelo se ajusta con ejemplos de cada negocio.

Datos: [Bitext en español](https://huggingface.co/datasets/Faramir/Bitext-customer-support-llm-chatbot-training-dataset-spanish)
(CDLA-Sharing-1.0), **sintético**: mensajes generados y traducidos, no escritos por clientes reales. Se descartaron 65 de
24.184 que quedaron sin traducir; la prueba tiene 20 mensajes por cada una de las 27 intenciones. No se sabe con qué datos
se entrenó Laya: no podemos descartar que haya visto Bitext en inglés.

## Estructura

| Carpeta | Qué hay |
|---|---|
| [`lab/`](lab) | Python (`system_one`): datos, decisiones, modelos, medición, inspección y exportación a la web |
| [`web/`](web) | React, Vite, Tailwind 4 y Three.js; sitio estático |
| [`docs/`](docs) | El proceso de implementación paso a paso para un cliente |

## Correrlo

```bash
cd lab && uv sync
uv run python -m system_one prepare && uv run python -m system_one evaluate laya && uv run python -m system_one export
cd ../web && pnpm install && pnpm dev
```

`pnpm build` deja la web en `web/dist`, lista para cualquier hosting de sitios estáticos.

## Licencia

Código bajo licencia MIT ([`LICENSE`](LICENSE)). No incluye los logos de API SERVICE SAC ni la foto de perfil. Laya y Kev
son de sus autores (Apache 2.0); los mensajes de Bitext mantienen su licencia CDLA-Sharing-1.0.
