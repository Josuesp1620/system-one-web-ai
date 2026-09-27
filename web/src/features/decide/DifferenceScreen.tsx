/** Paso 4.2 · Lo que decide es la diferencia de puntos entre la primera y la segunda. */
import { Card } from '../../components/ui/Card';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { probabilityMath } from '../../data/probability';
import { useAppState } from '../../state/AppState';
import { DifferenceExplainer } from './DifferenceExplainer';

export function DifferenceScreen() {
  const { decision } = useAppState();
  if (!decision) return null;
  const [first, second] = probabilityMath.ranking(decision.logits);
  const labelOf = (index: number) => decision.decision.options[index].label;
  return (
    <ScreenFrame control={<p className="text-sm">Pregunta: <b>{decision.decision.question}</b></p>} title="Lo que cuenta es la diferencia" sentence="Lo que decide el porcentaje no es cuántos puntos tiene cada alternativa, sino cuántos puntos le saca la primera a la segunda.">
      <Card className="mx-auto max-w-xl text-lg">
        <DifferenceExplainer winner={labelOf(first)} runnerUp={labelOf(second)} difference={decision.logits[first] - decision.logits[second]} temperature={decision.temperature} />
      </Card>
    </ScreenFrame>
  );
}
