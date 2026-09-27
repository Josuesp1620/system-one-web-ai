/** Paso 6.1 · Cuánto acierta, medido en 540 mensajes con su respuesta correcta. */
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { runReader } from '../../data/runs';
import { useAppState } from '../../state/AppState';
import { PlainResults } from './PlainResults';

export function AccuracyScreen() {
  const { study, studyRun } = useAppState();
  const run = study.runs[studyRun];
  return (
    <ScreenFrame title="¿Cuánto acierta?" sentence={`Medido en ${run.messages} mensajes de atención al cliente, cada uno con su respuesta correcta (${runReader.title(run)}).`}>
      <PlainResults run={run} />
      <p className="mt-4 text-sm text-muted">Los mensajes son del conjunto Bitext en español: sintéticos (generados y traducidos), 20 por cada una de las 27 intenciones.</p>
    </ScreenFrame>
  );
}
