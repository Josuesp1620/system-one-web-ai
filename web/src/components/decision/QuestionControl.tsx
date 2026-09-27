/** Selector de pregunta con la pregunta completa escrita debajo, para que se sepa qué se está respondiendo. */
import { useAppState } from '../../state/AppState';
import { DecisionPills } from './DecisionPills';

export function QuestionControl() {
  const { decision } = useAppState();
  return (
    <div className="space-y-2">
      <DecisionPills />
      {decision && <p className="text-sm">Pregunta: <b>{decision.decision.question}</b></p>}
    </div>
  );
}
