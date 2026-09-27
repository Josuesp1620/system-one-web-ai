/** Paso 4.1 · Laya le pone puntos a cada alternativa; la de más puntos gana. Se dice si acertó y contra quién. */
import { QuestionControl } from '../../components/decision/QuestionControl';
import { Card } from '../../components/ui/Card';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { Term } from '../../components/ui/Term';
import { answerReader } from '../../data/answers';
import { format } from '../../data/format';
import { probabilityMath } from '../../data/probability';
import { useAppState } from '../../state/AppState';
import { PointsChart } from './PointsChart';

export function PointsScreen() {
  const { decision, inspection } = useAppState();
  if (!decision || !inspection) return null;
  const correctKey = inspection.correct[decision.decision.id];
  const winner = probabilityMath.winner(decision.logits);
  const correctIndex = decision.decision.options.findIndex((option) => option.key === correctKey);
  const winnerLabel = decision.decision.options[winner].label;
  const verdict = winner === correctIndex
    ? <>Ganó <b>«{winnerLabel}»</b> porque tiene más puntos que las demás ({format.number(decision.logits[winner], 1)}), y era la respuesta correcta.</>
    : <>Ganó <b>«{winnerLabel}»</b> porque tiene más puntos que las demás ({format.number(decision.logits[winner], 1)}), pero la respuesta correcta era <b>«{answerReader.label(decision.decision, correctKey)}»</b> ({format.number(decision.logits[correctIndex], 1)}): aquí se equivocó.</>;
  return (
    <ScreenFrame title="Primero, puntos" control={<QuestionControl />}
      sentence={<>Laya le da <Term help="En la jerga se llaman «logits»: un número por alternativa que sale de la última capa del modelo. Más alto = más convencido.">puntos</Term> a cada alternativa. Los puntos pueden ser negativos: lo que importa es cuál tiene más. {verdict}</>}>
      <Card><PointsChart item={decision} correctKey={correctKey} /></Card>
    </ScreenFrame>
  );
}
