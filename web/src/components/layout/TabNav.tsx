/** Las pestañas del recorrido, numeradas. */
import { useAppState } from '../../state/AppState';
import { TABS } from '../../state/tabs';

export function TabNav() {
  const { tab, setTab } = useAppState();
  return (
    <nav className="no-scrollbar -mb-px flex min-w-0 flex-1 gap-0.5 overflow-x-auto md:justify-center" aria-label="Pasos">
      {TABS.map((item, index) => (
        <button key={item.id} onClick={() => setTab(item.id)}
          className={`shrink-0 whitespace-nowrap border-b-2 px-2 py-3.5 text-[13px] transition focus-visible:outline-2 focus-visible:outline-ink ${tab === item.id ? 'border-ink font-semibold' : 'border-transparent text-muted hover:text-ink'}`}>
          <span className="mr-1 font-mono text-[11px] text-muted">{index + 1}</span>{item.label}
        </button>
      ))}
    </nav>
  );
}
