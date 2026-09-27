/** Elige qué pregunta del caso de estudio mirar y la muestra completa. */
import { useAppState } from '../../state/AppState';
import { Pills } from '../ui/Pills';

const NAMES: Record<string, string> = { area: 'Área (11)', intent: 'Intención (27)', complaint: '¿Reclamo? (sí/no)' };

export function StudyDecisionPills() {
  const { study, studyRun, studyDecision, setStudyDecision } = useAppState();
  const decisions = study.runs[studyRun].decisions;
  return (
    <div className="space-y-2">
      <Pills value={studyDecision} onChange={setStudyDecision} pills={Object.keys(decisions).map((id) => ({ value: id, label: NAMES[id] ?? id }))} />
      <p className="text-sm">Pregunta: <b>{decisions[studyDecision].decision.question}</b></p>
    </div>
  );
}
