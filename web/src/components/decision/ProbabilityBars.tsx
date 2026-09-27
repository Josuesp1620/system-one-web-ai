/** Las alternativas de una decisión con su barra de probabilidad. Con muchas alternativas muestra las primeras y
 * resume el resto en una línea. */
import { format } from '../../data/format';
import { palette } from '../../data/palette';
import { probabilityMath } from '../../data/probability';
import type { DecisionInfo } from '../../data/types';

type Props = { decision: DecisionInfo; probabilities: number[]; limit?: number; correctKey?: string };

export function ProbabilityBars({ decision, probabilities, limit = 5, correctKey }: Props) {
  const ranking = probabilityMath.ranking(probabilities);
  const shown = ranking.slice(0, limit);
  const hidden = ranking.slice(limit);
  const hiddenTotal = hidden.reduce((sum, index) => sum + probabilities[index], 0);
  return (
    <div className="space-y-1.5">
      {shown.map((index) => (
        <ProbabilityRow key={index} label={decision.options[index].label} probability={probabilities[index]} color={palette.option(index)}
          isCorrect={decision.options[index].key === correctKey} />
      ))}
      {hidden.length > 0 && <p className="text-[11px] text-muted">otras {hidden.length} alternativas: {format.percent(hiddenTotal)} en total</p>}
    </div>
  );
}

function ProbabilityRow({ label, probability, color, isCorrect }: { label: string; probability: number; color: string; isCorrect: boolean }) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <span className="w-32 truncate text-ink/80" title={label}>{label}{isCorrect && <span className="ml-1 text-positive" title="respuesta correcta">✓</span>}</span>
      <span className="h-1.5 flex-1 rounded-full bg-white/[0.06]">
        <span className="block h-full rounded-full transition-[width] duration-500" style={{ width: `${probability * 100}%`, background: color }} />
      </span>
      <span className="w-14 text-right font-mono text-muted">{format.percent(probability)}</span>
    </div>
  );
}
