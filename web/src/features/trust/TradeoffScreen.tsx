/** Paso 5.2 · El equilibrio: más exigencia, menos errores, pero más trabajo para personas. */
import { Card } from '../../components/ui/Card';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { useAppState } from '../../state/AppState';
import { ThresholdTable } from './ThresholdTable';

export function TradeoffScreen() {
  const { study, studyRun, studyDecision, threshold } = useAppState();
  const summary = study.runs[studyRun].decisions[studyDecision];
  return (
    <ScreenFrame control={<p className="text-sm">Pregunta: <b>{summary.decision.question}</b></p>} title="Más exigente, menos errores" sentence="Mientras más seguridad exiges, menos errores se cuelan, pero más mensajes tiene que revisar una persona. Cada negocio elige su punto de equilibrio.">
      <Card className="mx-auto max-w-xl"><ThresholdTable curve={summary.coverageCurve} current={threshold} /></Card>
    </ScreenFrame>
  );
}
