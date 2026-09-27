# Proceso de implementación paso a paso

Cómo se lleva un modelo System One (Laya o Kev) a producción para un cliente, con el mismo código de `lab/`. Cada paso
tiene un comando, un entregable y un criterio para pasar al siguiente. Los ejemplos usan el caso de estudio de este
repositorio (atención al cliente con Bitext); con datos de un cliente solo cambian el cargador de datos y las decisiones.

| Paso | Qué se hace | Comando | Entregable |
|---|---|---|---|
| 1. Definir | Qué decisiones se automatizan: pregunta, alternativas y dónde está la respuesta correcta | `system_one/tasks/` | Lista de decisiones acordada con el cliente |
| 2. Datos | Reunir mensajes con su respuesta correcta, limpiarlos y separar entrenamiento y prueba | `python -m system_one prepare` | `data/prepared/` + informe de limpieza |
| 3. Medir | Cuánto acierta el modelo tal como viene, en CPU | `python -m system_one evaluate …` | Informe de acierto, calibración y velocidad |
| 4. Ajustar | Ajuste fino con los ejemplos del cliente | (siguiente versión) | Checkpoint propio + nueva medición |
| 5. Calibrar | Elegir el umbral: qué se automatiza y qué pasa a una persona | curva de automatización del paso 3 | Umbral acordado y su tasa de error esperada |
| 6. Desplegar | Procesar en lote o por API, en CPU | (siguiente versión) | Servicio en producción |
| 7. Monitorear | Revisar muestras, medir errores y reentrenar con ellos | (siguiente versión) | Informe periódico |

## 1. Definir las decisiones

Una decisión es una pregunta con alternativas cerradas. Se escribe como un `Decision` en `system_one/tasks/`:

- **Tipo:** `choice` (una de varias alternativas) o `noul` (sí o no).
- **Alternativas:** cada una con una clave interna (la de los datos) y un texto en español, que es lo que lee el modelo.
- **Respuesta correcta:** de qué campo de los datos sale.

Criterio para seguir: el cliente aprueba la lista de decisiones y sus alternativas. Menos de ~20 alternativas por
pregunta: Laya pierde precisión con muchas más (en su propio benchmark, 42,5 % con 77 alternativas).

## 2. Preparar los datos

- Mínimo recomendado: **300 a 1.000 mensajes con su respuesta correcta** por decisión, revisados por el cliente.
- Se quitan datos personales (nombres, teléfonos, documentos) antes de que salgan de sus sistemas.
- `prepare` limpia (por ejemplo, descarta mensajes en otro idioma), separa una prueba balanceada y deja el resto para
  el ajuste fino. El informe dice cuántos mensajes se descartaron y por qué.

Criterio para seguir: el conjunto de prueba representa lo que llega de verdad (todas las alternativas, varios estilos).

## 3. Medir el modelo base

Antes de tocar el modelo se mide en el conjunto de prueba:

- **Acierto** por decisión y **matriz de confusión** (en qué se confunde).
- **Calibración:** si dice «80 % seguro», ¿acierta el 80 % de las veces?
- **Curva de automatización:** para cada umbral, qué parte se automatiza y con cuánto acierto.
- **Velocidad:** milisegundos por mensaje en CPU (en este caso de estudio, 316 ms con Laya).

Criterio para seguir: si el acierto con el umbral elegido ya alcanza el objetivo del cliente, se salta al paso 5; si no,
se ajusta (paso 4).

## 4. Ajustar el modelo

Ajuste fino con los mensajes de entrenamiento del cliente.
Se vuelve a medir con el mismo conjunto de prueba del paso 3 para comparar antes y después. Referencia: en el benchmark de
Laya, el checkpoint base acierta 36,2 % en decisiones de flujos de trabajo y el ajustado, 76,6 %.

## 5. Calibrar y fijar el umbral

Con la curva de automatización del modelo final, el cliente elige el punto de equilibrio: por ejemplo, «automatizar solo
lo que tenga al menos 90 % de seguridad». Lo demás pasa a una persona. Se documenta la tasa de error esperada en lo
automatizado.

## 6. Desplegar

- **Por lotes** (mensajes que se procesan cada pocos minutos) o **por API** (una respuesta por mensaje): Laya en CPU,
  en el servidor del cliente o en uno propio. Sin costo por uso.
- Los datos pueden quedarse en la infraestructura del cliente: los modelos son abiertos (Apache 2.0).

## 7. Monitorear

Se guardan las decisiones, se revisa una muestra cada semana, se miden los errores y se reentrena con ellos cuando el
acierto baja del objetivo.
