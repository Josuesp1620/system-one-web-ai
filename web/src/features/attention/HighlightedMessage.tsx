/** El mensaje como una hoja de papel: cada palabra resaltada según la atención que recibió, con el % en las más miradas. */
import { Eyebrow } from '../../components/ui/Eyebrow';
import { format } from '../../data/format';
import type { WeightedWord } from '../../data/words';

type Props = { words: WeightedWord[]; color: string; caption: string; labeledCount?: number };

export function HighlightedMessage({ words, color, caption, labeledCount = 3 }: Props) {
  const strongest = Math.max(...words.map((word) => word.weight), 1e-6);
  const labeled = new Set([...words].sort((first, second) => second.weight - first.weight).slice(0, labeledCount));
  const opacity = (weight: number) => Math.round((0.08 + 0.92 * Math.min(1, weight / strongest)) * 255).toString(16).padStart(2, '0');
  return (
    <div className="rounded-2xl bg-[#f4f1ea] p-5 shadow-2xl">
      <Eyebrow className="!text-[#8a8577]">{caption}</Eyebrow>
      <p className="mt-3 flex flex-wrap gap-x-1.5 gap-y-3 text-[22px] text-[#1d1b17]">
        {words.map((word, index) => (
          <span key={index} className="inline-flex flex-col items-center">
            <span className="rounded px-1 transition-colors duration-300" style={{ background: `${color}${opacity(word.weight)}` }}>{word.text}</span>
            <span className="h-4 font-mono text-[11px] text-[#6b665a]">{labeled.has(word) ? format.percent(word.weight, 1) : ''}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
