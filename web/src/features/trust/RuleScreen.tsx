/** Paso 5.1 · La regla «si estás seguro, hazlo; si no, pásalo a una persona», aplicada a cada 100 mensajes. */
import { StudyDecisionPills } from '../../components/study/StudyDecisionPills';
import { Card } from '../../components/ui/Card';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { Slider } from '../../components/ui/Slider';
import { format } from '../../data/format';
import { runReader } from '../../data/runs';
import { useAppState } from '../../state/AppState';
import { HundredGrid } from './HundredGrid';
import { HowCalculated } from './HowCalculated';
import { HundredLegend } from './HundredLegend';
import { perHundred } from './hundredSplit';

export function RuleScreen() {
  const { study, studyRun, studyDecision, threshold, setThreshold } = useAppState();
  const run = study.runs[studyRun];
  const summary = run.decisions[studyDecision];
  const point = runReader.pointAt(summary.coverageCurve, threshold);
  const split = perHundred.split(point);
  return (
    <ScreenFrame title="¿Lo hace solo o lo pasa a una persona?" control={<StudyDecisionPills />}
      sentence={<>La regla: <b>si Laya está al menos {format.percent(threshold)} seguro, lo resuelve solo</b>; si no, lo revisa una persona. Así queda con cada 100 mensajes medidos.</>}>
      <Card>
        <Slider id="threshold" label="Seguridad mínima" value={threshold} min={0.5} max={0.99} step={0.05} onChange={setThreshold} display={(value) => format.percent(value)} />
        <div className="mt-6 flex flex-col items-center gap-8 md:flex-row">
          <HundredGrid split={split} />
          <HundredLegend split={split} />
        </div>
        <HowCalculated point={point} messages={run.messages} />
      </Card>
    </ScreenFrame>
  );
}
