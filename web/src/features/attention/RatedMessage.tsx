/** El mensaje con cada palabra marcada según su papel: pista (verde), imprescindible (rosa) o ambas. */
import type { RatedWord, WordRole } from './wordRoles';

const STYLES: Record<WordRole, string> = {
  'essential-clue': 'bg-alert/25 text-ink ring-2 ring-positive',
  essential: 'bg-alert/25 text-ink',
  clue: 'bg-positive/20 text-ink',
  none: 'text-ink/55',
};

export function RatedMessage({ words, answer }: { words: RatedWord[]; answer: string }) {
  return (
    <div>
      <p className="flex flex-wrap gap-x-1.5 gap-y-2 text-[22px] leading-relaxed">
        {words.map((word, index) => <span key={index} className={`rounded px-1 ${STYLES[word.role]}`}>{word.text}</span>)}
      </p>
      <p className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-positive/60" />Pista: esta palabra sola ya basta para responder «{answer}».</span>
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-alert/60" />Imprescindible: si se quita, Laya deja de estar seguro de «{answer}».</span>
      </p>
    </div>
  );
}
