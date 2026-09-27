/** Las dos listas con sus cifras reales: pistas (con la palabra sola) e imprescindibles (sin la palabra). */
import { format } from '../../data/format';
import type { RatedWord } from './wordRoles';

type Props = { words: RatedWord[]; baseline: number; answer: string };

export function WordLists({ words, baseline, answer }: Props) {
  const clues = words.filter((word) => word.role === 'clue' || word.role === 'essential-clue').sort((first, second) => second.alone - first.alone);
  const essentials = words.filter((word) => word.role === 'essential' || word.role === 'essential-clue').sort((first, second) => first.without - second.without);
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl bg-positive/[0.07] px-4 py-3">
        <p className="text-sm font-semibold text-positive">Pistas</p>
        <p className="mb-2 text-xs text-muted">Si Laya lee solo esta palabra, ¿qué tan seguro está de «{answer}»?</p>
        {clues.length === 0 ? <p className="text-sm text-ink/70">Ninguna palabra, por sí sola, basta para responder «{answer}».</p> : (
          <ul className="space-y-1 text-sm">{clues.map((word, index) => <li key={index}>Solo «{word.text}»: {format.percent(word.alone)} seguro</li>)}</ul>
        )}
      </div>
      <div className="rounded-xl bg-alert/[0.07] px-4 py-3">
        <p className="text-sm font-semibold text-alert">Imprescindibles</p>
        <p className="mb-2 text-xs text-muted">Con el mensaje completo está {format.percent(baseline)} seguro. ¿A cuánto baja si se quita la palabra?</p>
        {essentials.length === 0 ? <p className="text-sm text-ink/70">Ninguna. Quitando cualquier palabra, la seguridad casi no cambia.</p> : (
          <ul className="space-y-1 text-sm">{essentials.map((word, index) => <li key={index}>Sin «{word.text}»: baja a {format.percent(word.without)}</li>)}</ul>
        )}
      </div>
    </div>
  );
}
