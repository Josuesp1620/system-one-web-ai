/** Ejemplos reales de la medición: aciertos o errores con más seguridad. */
import { format } from '../../data/format';
import type { Example } from '../../data/types';

type Props = { title: string; examples: Example[]; labelFor: (key: string) => string; tone: string };

export function ExampleList({ title, examples, labelFor, tone }: Props) {
  return (
    <div>
      <p className={`mb-2 text-sm font-semibold ${tone}`}>{title}</p>
      <ul className="space-y-2 text-[13px] text-ink/85">
        {examples.map((example) => (
          <li key={example.messageId} className="rounded-lg bg-white/[0.035] px-3 py-2">
            «{example.text}»<br />
            <span className="text-muted">respondió {labelFor(example.predicted)} ({format.percent(example.confidence)})
              {!example.isCorrect && <> · correcta: {labelFor(example.correct)}</>}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
