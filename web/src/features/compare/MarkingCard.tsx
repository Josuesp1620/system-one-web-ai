/** La respuesta real de Laya: marca la alternativa ganadora y da un porcentaje a cada una, todo de una vez. */
import { ProbabilityBars } from '../../components/decision/ProbabilityBars';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import type { InspectedDecision } from '../../data/types';

export function MarkingCard({ item, correctKey }: { item: InspectedDecision; correctKey?: string }) {
  return (
    <Card className="ring-1 ring-accent/30">
      <div className="mb-3 flex items-center justify-between">
        <Eyebrow className="text-accent">MARCA · COMO LAYA</Eyebrow>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">respuesta real</span>
      </div>
      <p className="mb-3 text-sm text-ink/70">{item.decision.question}</p>
      <ProbabilityBars decision={item.decision} probabilities={item.probabilities} limit={5} correctKey={correctKey} />
      <p className="mt-5 border-t border-line pt-3 font-mono text-[11px] text-muted">palabras escritas: <span className="text-accent">0</span> · responde todas las alternativas a la vez</p>
    </Card>
  );
}
