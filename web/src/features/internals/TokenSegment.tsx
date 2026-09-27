/** Una parte rotulada de la fila (pregunta, alternativas o mensaje) con sus tokens. */
import type { ReactNode } from 'react';

export function TokenSegment({ number, title, note, children }: { number: number; title: string; note?: string; children: ReactNode }) {
  return (
    <section className="glass rounded-2xl p-4">
      <p className="mb-2 text-sm"><span className="mr-2 font-mono text-accent">{number}</span><b>{title}</b>{note && <span className="text-muted"> · {note}</span>}</p>
      <div className="flex flex-wrap items-center gap-y-1.5">{children}</div>
    </section>
  );
}
