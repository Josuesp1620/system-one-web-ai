/** Paso 2: la diferencia de puntos entre la primera y la segunda, y cuántas veces más probable la vuelve. */
import { format } from '../../data/format';

type Props = { winner: string; runnerUp: string; difference: number; temperature: number };

export function DifferenceExplainer({ winner, runnerUp, difference, temperature }: Props) {
  const times = Math.exp(difference / temperature);
  const readable = times > 1000 ? 'más de 1.000' : format.number(times, times < 10 ? 1 : 0);
  return (
    <div className="space-y-2 text-sm">
      <p>«{winner}» tiene <b className="text-accent">{format.number(difference, 1)} puntos más</b> que «{runnerUp}».</p>
      <p className="text-ink/75">Así funciona la fórmula: cada punto de diferencia hace a la primera unas 2,7 veces más probable que la segunda{temperature !== 1 ? ` (con la temperatura elegida, cada punto se divide entre ${format.number(temperature, 2)})` : ''}.</p>
      <p>Con {format.number(difference, 1)} puntos de diferencia, «{winner}» resulta <b className="text-accent">{readable} veces</b> más probable que «{runnerUp}».</p>
    </div>
  );
}
