/** Una decisión con la respuesta de Laya, sus probabilidades y si coincide con la respuesta correcta. */
import { ProbabilityBars } from '../../components/decision/ProbabilityBars';
import { answerReader } from '../../data/answers';
import type { InspectedDecision } from '../../data/types';

type Props = { item: InspectedDecision; correctKey?: string; selected: boolean; onSelect: () => void };

export function DecisionCard({ item, correctKey, selected, onSelect }: Props) {
  const isCorrect = answerReader.isCorrect(item.decision, item.probabilities, correctKey);
  return (
    <button onClick={onSelect} className={`glass block w-full rounded-xl p-4 text-left transition hover:border-white/30 ${selected ? 'ring-1 ring-white/30' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] text-ink/80">{item.decision.question}</p>
        <CorrectBadge isCorrect={isCorrect} />
      </div>
      <p className="mt-1 font-display text-xl font-extrabold text-accent">{answerReader.winnerText(item.decision, item.probabilities)}</p>
      <div className="mt-2.5"><ProbabilityBars decision={item.decision} probabilities={item.probabilities} limit={3} correctKey={correctKey} /></div>
    </button>
  );
}

function CorrectBadge({ isCorrect }: { isCorrect: boolean }) {
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${isCorrect ? 'bg-positive/15 text-positive' : 'bg-alert/15 text-alert'}`}>
      {isCorrect ? 'acertó' : 'se equivocó'}
    </span>
  );
}
