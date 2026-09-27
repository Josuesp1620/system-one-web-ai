/** Elige cuál de las tres preguntas mirar (área, intención o reclamo). */
import { useAppState } from '../../state/AppState';
import { Pills } from '../ui/Pills';

const SHORT_NAMES: Record<string, string> = { area: 'Área', intent: 'Intención', complaint: '¿Es reclamo?' };

export function DecisionPills() {
  const { inspection, decisionIndex, setDecisionIndex } = useAppState();
  if (!inspection) return null;
  return (
    <Pills value={decisionIndex} onChange={setDecisionIndex}
      pills={inspection.decisions.map((item, index) => ({ value: index, label: SHORT_NAMES[item.decision.id] ?? item.decision.id }))} />
  );
}
