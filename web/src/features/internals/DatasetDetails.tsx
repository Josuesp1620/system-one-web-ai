/** El conjunto de datos y el modelo en detalle: limpieza (con ejemplos descartados) y la ficha técnica de Laya. */
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { format } from '../../data/format';
import { useAppState } from '../../state/AppState';

export function DatasetDetails() {
  const { study, modelCard } = useAppState();
  const dataset = study.dataset;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <Eyebrow>DATOS · {dataset.source.repository}</Eyebrow>
        <p className="mt-2 text-sm text-ink/80">Licencia {dataset.source.license} · sintético · {format.integer(dataset.loaded)} mensajes</p>
        <p className="mt-2 text-sm text-ink/80">Descartados por quedar sin traducir: <b>{dataset.cleaning.droppedUntranslated}</b>. Por ejemplo:</p>
        <ul className="mt-2 space-y-1 font-mono text-[11px] text-muted">{dataset.cleaning.examplesDropped.slice(0, 5).map((text) => <li key={text}>«{text}»</li>)}</ul>
      </Card>
      <Card>
        <Eyebrow>MODELO · {modelCard.repository}</Eyebrow>
        <ul className="mt-2 space-y-1 text-sm text-ink/80">
          <li>Encoder {modelCard.encoder}: {modelCard.layers} capas, {modelCard.heads} cabezas, vectores de {modelCard.dimensions}</li>
          <li>1 de cada 3 capas lee toda la fila; las demás, {modelCard.localWindow} tokens alrededor</li>
          <li>Vocabulario de {format.integer(modelCard.vocabulary)} tokens · {Math.round(modelCard.parameters / 1e6)} M parámetros</li>
          <li>Cabeza de decisión: {modelCard.headLayers} capas más · temperatura {format.number(modelCard.temperatures[0], 1)}</li>
        </ul>
      </Card>
    </div>
  );
}
