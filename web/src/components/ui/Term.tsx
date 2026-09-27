/** Palabra técnica con su explicación simple al pasar el mouse. */
import type { ReactNode } from 'react';

export function Term({ children, help }: { children: ReactNode; help: string }) {
  return (
    <span className="group relative cursor-help border-b border-dotted border-muted">
      {children}
      <span role="tooltip" className="glass pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-64 -translate-x-1/2 rounded-lg px-3 py-2 text-left font-sans text-xs font-normal leading-relaxed text-ink group-hover:block">
        {help}
      </span>
    </span>
  );
}
