/** Una pantalla del recorrido guiado: título corto, una frase y un solo gráfico, centrados. */
import type { ReactNode } from 'react';

type Props = { title: ReactNode; sentence?: ReactNode; control?: ReactNode; children: ReactNode };

export function ScreenFrame({ title, sentence, control, children }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-[42px]">{title}</h2>
      {sentence && <p className="mt-3 text-lg leading-relaxed text-ink/75">{sentence}</p>}
      {control && <div className="mt-5">{control}</div>}
      <div className="mt-8">{children}</div>
    </div>
  );
}
