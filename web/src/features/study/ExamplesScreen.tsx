/** Paso 6.4 · Ejemplos reales: sus aciertos y sus errores más seguros. */
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { answerReader } from '../../data/answers';
import { useAppState } from '../../state/AppState';
import { ExampleList } from './ExampleList';

export function ExamplesScreen() {
  const { study, studyRun } = useAppState();
  const summary = study.runs[studyRun].decisions.area;
  const labelFor = (key: string) => answerReader.label(summary.decision, key);
  return (
    <ScreenFrame title="Ejemplos reales" sentence="Mensajes reales de la prueba y el área que eligió Laya: a la izquierda, aciertos; a la derecha, errores que cometió estando muy seguro.">
      <div className="grid gap-4 md:grid-cols-2">
        <ExampleList title="Acertó" examples={study.examples.area.right.slice(0, 3)} labelFor={labelFor} tone="text-positive" />
        <ExampleList title="Se equivocó muy seguro" examples={study.examples.area.wrong.slice(0, 3)} labelFor={labelFor} tone="text-alert" />
      </div>
    </ScreenFrame>
  );
}
