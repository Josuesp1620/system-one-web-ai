/** Con qué se confunde más, en palabras: las parejas (respondió / era) que más se repiten. */
import type { DecisionSummary } from '../../data/types';


class ConfusionReader {
  top(summary: DecisionSummary, limit: number): { answered: string; correct: string; count: number }[] {
    const labelFor = (key: string) => summary.decision.options.find((option) => option.key === key)?.label ?? key;
    const pairs = summary.confusionMatrix.flatMap((row, correctIndex) =>
      row.map((count, answeredIndex) => ({ answered: labelFor(summary.keys[answeredIndex]), correct: labelFor(summary.keys[correctIndex]), count, isMistake: correctIndex !== answeredIndex })));
    return pairs.filter((pair) => pair.isMistake && pair.count > 0).sort((first, second) => second.count - first.count).slice(0, limit);
  }
}

const confusionReader = new ConfusionReader();

export function TopConfusions({ summary, limit = 5 }: { summary: DecisionSummary; limit?: number }) {
  const pairs = confusionReader.top(summary, limit);
  if (pairs.length === 0) return <p className="text-sm text-muted">No se confundió en ningún mensaje.</p>;
  return (
    <ul className="space-y-2 text-[14px]">
      {pairs.map((pair) => (
        <li key={`${pair.answered}-${pair.correct}`} className="flex items-baseline gap-3">
          <span className="w-10 text-right font-display text-2xl font-extrabold text-alert">{pair.count}</span>
          <span>veces respondió <b>«{pair.answered}»</b> cuando era <b>«{pair.correct}»</b></span>
        </li>
      ))}
    </ul>
  );
}
