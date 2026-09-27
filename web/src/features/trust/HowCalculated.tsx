/** El porqué de la cuadrícula: los conteos reales de los mensajes medidos detrás de «de cada 100». */
import { format } from '../../data/format';
import type { CoveragePoint } from '../../data/types';

export function HowCalculated({ point, messages }: { point: CoveragePoint; messages: number }) {
  const automated = Math.round(point.coverage * messages);
  const right = Math.round(point.coverage * (point.accuracy ?? 0) * messages);
  return (
    <p className="mt-4 rounded-xl bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-ink/80">
      <b>De dónde sale:</b> de los {messages} mensajes medidos, en <b>{automated}</b> Laya tuvo al menos {format.percent(point.threshold)} de seguridad.
      De esos, <b className="text-positive">{right} estaban bien</b> y <b className="text-alert">{automated - right} mal</b>. Los otros {messages - automated} no llegaron a esa
      seguridad y los revisaría una persona. La cuadrícula es lo mismo llevado a 100.
    </p>
  );
}
