/** La lectura de la cuadrícula en tres cifras grandes. */
import type { HundredSplit } from './HundredGrid';

const ROWS = [
  { key: 'right', color: 'text-positive', label: 'se resuelven solos, y bien' },
  { key: 'wrong', color: 'text-alert', label: 'se resuelven solos, pero mal (errores)' },
  { key: 'person', color: 'text-ink', label: 'los revisa una persona' },
] as const;

export function HundredLegend({ split }: { split: HundredSplit }) {
  return (
    <div className="space-y-3">
      {ROWS.map((row) => (
        <p key={row.key} className="flex items-baseline gap-3">
          <span className={`w-14 text-right font-display text-4xl font-extrabold tabular-nums ${row.color}`}>{split[row.key]}</span>
          <span className="text-[15px] text-ink/80">{row.label}</span>
        </p>
      ))}
    </div>
  );
}
