/** Los puntos de las alternativas con más puntos, como barras: la más larga ganó; se marca cuál era la correcta. */
import { format } from '../../data/format';
import { palette } from '../../data/palette';
import { probabilityMath } from '../../data/probability';
import type { InspectedDecision } from '../../data/types';

const SHOWN = 6;

export function PointsChart({ item, correctKey }: { item: InspectedDecision; correctKey?: string }) {
  const ranking = probabilityMath.ranking(item.logits).slice(0, SHOWN);
  const lowest = Math.min(...item.logits);
  const range = Math.max(...item.logits) - lowest || 1;
  return (
    <div className="space-y-2">
      {ranking.map((index, position) => {
        const option = item.decision.options[index];
        return (
          <div key={index} className="grid grid-cols-[170px_1fr_60px] items-center gap-3 text-sm">
            <span className="truncate text-right">{option.label}{option.key === correctKey && <span className="ml-1 text-positive">✓ correcta</span>}</span>
            <span className="h-5 rounded bg-white/[0.04]">
              <span className="block h-full rounded" style={{ width: `${8 + ((item.logits[index] - lowest) / range) * 92}%`, background: position === 0 ? palette.option(index) : `${palette.option(index)}66` }} />
            </span>
            <span className={`font-mono ${position === 0 ? 'text-accent' : 'text-muted'}`}>{format.number(item.logits[index], 1)}</span>
          </div>
        );
      })}
      {item.logits.length > SHOWN && <p className="text-right text-[11px] text-muted">y {item.logits.length - SHOWN} alternativas con menos puntos</p>}
    </div>
  );
}
