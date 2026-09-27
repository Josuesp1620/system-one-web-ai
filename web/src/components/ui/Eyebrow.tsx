/** Rótulo pequeño en mayúsculas sobre un bloque. */
import type { ReactNode } from 'react';

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-[10px] tracking-[0.18em] text-muted ${className}`}>{children}</p>;
}
