/** ¿Su seguridad es honesta? Por tramo de seguridad: lo que dijo frente a lo que acertó de verdad. */
import { format } from '../../data/format';
import type { CalibrationBin } from '../../data/types';

const MINIMUM_MESSAGES = 10;

export function HonestyBars({ bins, limit = 10 }: { bins: CalibrationBin[]; limit?: number }) {
  const shown = bins.filter((bin) => bin.count >= MINIMUM_MESSAGES).reverse().slice(0, limit);
  return (
    <div className="space-y-3">
      {shown.map((bin) => (
        <div key={bin.from}>
          <p className="mb-1 text-[13px] text-ink/80">Cuando dijo estar <b>{format.percent(bin.from)}–{format.percent(bin.to)}</b> seguro <span className="text-muted">({bin.count} mensajes)</span></p>
          <HonestyBar label="dijo" value={bin.meanConfidence} color="#8d94a5" />
          <HonestyBar label="acertó" value={bin.accuracy} color="#9ae6b4" />
        </div>
      ))}
    </div>
  );
}

function HonestyBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <span className="w-12 text-muted">{label}</span>
      <span className="h-2.5 flex-1 rounded-full bg-white/[0.05]"><span className="block h-full rounded-full" style={{ width: `${value * 100}%`, background: color }} /></span>
      <span className="w-14 text-right font-mono">{format.percent(value)}</span>
    </div>
  );
}
