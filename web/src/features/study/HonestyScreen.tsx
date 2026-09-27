/** Paso 6.2 · ¿Su seguridad es honesta? Cuando dice estar muy seguro, ¿acierta de verdad? */
import { StudyDecisionPills } from '../../components/study/StudyDecisionPills';
import { Card } from '../../components/ui/Card';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { format } from '../../data/format';
import { useAppState } from '../../state/AppState';
import { HonestyBars } from './HonestyBars';

export function HonestyScreen() {
  const { study, studyRun, studyDecision } = useAppState();
  const bins = study.runs[studyRun].decisions[studyDecision].calibration;
  const largest = [...bins].sort((first, second) => second.count - first.count)[0];
  const gap = largest.meanConfidence - largest.accuracy;
  const reading = Math.abs(gap) < 0.05 ? 'su seguridad es honesta' : gap > 0 ? 'exagera un poco su seguridad' : 'es más prudente de lo necesario';
  return (
    <ScreenFrame title="¿Su seguridad es honesta?" control={<StudyDecisionPills />}
      sentence="Si dice estar 90 % seguro, debería acertar 9 de cada 10 veces. Si las dos barras de cada tramo se parecen, se puede confiar en el porcentaje que da.">
      <Card className="mx-auto max-w-xl"><HonestyBars bins={bins} limit={3} /></Card>
      <p className="mt-4 rounded-xl bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-ink/80">
        <b>Lectura:</b> en la mayoría de los mensajes ({largest.count}), dijo estar en promedio {format.percent(largest.meanConfidence)} seguro y acertó el {format.percent(largest.accuracy)}: {reading}.
        Cuando dice estar menos seguro, acierta bastante menos; en esos casos conviene que revise una persona.
      </p>
    </ScreenFrame>
  );
}
