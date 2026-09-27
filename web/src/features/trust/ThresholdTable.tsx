/** Algunos umbrales de referencia en palabras: cuánto se automatiza y cuántos errores se cuelan de cada 100. */
import { format } from '../../data/format';
import { runReader } from '../../data/runs';
import type { CoveragePoint } from '../../data/types';
import { perHundred } from './hundredSplit';

const REFERENCES = [0.5, 0.7, 0.9, 0.99];

export function ThresholdTable({ curve, current }: { curve: CoveragePoint[]; current: number }) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="text-[11px] text-muted"><tr><th className="py-1 font-normal">Seguridad mínima</th><th className="font-normal">Mensajes que resuelve solo</th><th className="font-normal">De esos, con error</th></tr></thead>
      <tbody>
        {REFERENCES.map((threshold) => {
          const point = runReader.pointAt(curve, threshold);
          const split = perHundred.split(point);
          return (
            <tr key={threshold} className={`border-t border-line ${Math.abs(point.threshold - current) < 0.001 ? 'text-accent' : ''}`}>
              <td className="py-1.5 font-mono">{format.percent(point.threshold)}</td>
              <td className="font-mono">{split.right + split.wrong} de 100</td>
              <td className="font-mono">{split.wrong} de 100</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
