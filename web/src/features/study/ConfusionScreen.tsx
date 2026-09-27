/** Paso 6.3 · Con qué se confunde más, en palabras. */
import { StudyDecisionPills } from '../../components/study/StudyDecisionPills';
import { Card } from '../../components/ui/Card';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { useAppState } from '../../state/AppState';
import { TopConfusions } from './TopConfusions';

export function ConfusionScreen() {
  const { study, studyRun, studyDecision } = useAppState();
  const run = study.runs[studyRun];
  const summary = run.decisions[studyDecision];
  const errors = run.messages - Math.round(summary.accuracy * run.messages);
  return (
    <ScreenFrame title="¿Con qué se confunde?" sentence={`Se equivocó en ${errors} de ${run.messages} mensajes. Estos son los errores que más repitió; casi siempre confunde áreas o intenciones que se parecen.`} control={<StudyDecisionPills />}>
      <Card className="mx-auto max-w-xl"><TopConfusions summary={summary} limit={3} /></Card>
    </ScreenFrame>
  );
}
