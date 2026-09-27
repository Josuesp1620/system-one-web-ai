/** Encabezado: nombre y autoría; debajo, los pasos del recorrido. */
import { Authors } from './Authors';
import { TabNav } from './TabNav';

export function Header() {
  return (
    <header className="relative z-10 flex flex-wrap items-center gap-x-5 border-b border-line bg-canvas px-4 md:flex-nowrap md:px-6">
      <span className="shrink-0 py-3 font-display text-xl font-extrabold tracking-wide">SYSTEM ONE</span>
      <TabNav />
      <Authors />
    </header>
  );
}
