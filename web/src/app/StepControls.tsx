/** Avance del recorrido: puntos de las pantallas del paso y botones Anterior / Siguiente (que cruzan de paso). */
import { useAppState } from '../state/AppState';
import { TABS } from '../state/tabs';
import { SCREENS } from './screens';

export function StepControls() {
  const { tab, screen, setTab, setScreen } = useAppState();
  const tabIndex = TABS.findIndex((item) => item.id === tab);
  const count = SCREENS[tab].length;
  const previous = () => {
    if (screen > 0) return setScreen(screen - 1);
    if (tabIndex > 0) setTab(TABS[tabIndex - 1].id, SCREENS[TABS[tabIndex - 1].id].length - 1);
  };
  const next = () => {
    if (screen < count - 1) return setScreen(screen + 1);
    if (tabIndex < TABS.length - 1) setTab(TABS[tabIndex + 1].id);
  };
  const showScreens = tab !== 'internals';      // en «Técnico» las vistas se eligen en el panel lateral
  const isFirst = tabIndex === 0 && screen === 0;
  const isLast = tabIndex === TABS.length - 1 && screen === count - 1;
  return (
    <div className="mx-auto mt-10 flex w-full max-w-3xl items-center justify-between gap-4">
      <button onClick={previous} disabled={isFirst} className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10 disabled:opacity-30">← Anterior</button>
      {showScreens && <div className="flex gap-2" aria-label={`Pantalla ${screen + 1} de ${count}`}>
        {Array.from({ length: count }, (value, index) => (
          <button key={index} onClick={() => setScreen(index)} aria-label={`Ir a la pantalla ${index + 1}`}
            className={`h-2.5 rounded-full transition-all ${index === screen ? 'w-6 bg-accent' : 'w-2.5 bg-white/25 hover:bg-white/50'}`} />
        ))}
      </div>}
      {showScreens && <button onClick={next} disabled={isLast} className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-canvas transition hover:bg-white disabled:opacity-30">Siguiente →</button>}
    </div>
  );
}
