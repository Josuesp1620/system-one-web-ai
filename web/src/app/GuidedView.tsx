/** La pantalla actual del recorrido, con su rótulo de paso y los controles de avance. */
import { AnimatePresence, motion } from 'motion/react';
import { MessageBanner } from '../components/decision/MessageBanner';
import { useAppState } from '../state/AppState';
import { TABS } from '../state/tabs';
import { SCREENS, USES_MESSAGE } from './screens';
import { StepControls } from './StepControls';

export function GuidedView() {
  const { tab, screen } = useAppState();
  const tabIndex = TABS.findIndex((item) => item.id === tab);
  const Screen = SCREENS[tab][screen] ?? SCREENS[tab][0];
  return (
    <div className="thin-scroll absolute inset-0 overflow-y-auto">
      <div className="flex min-h-full flex-col justify-center px-5 py-12 md:px-10">
        <p className="mx-auto mb-3 w-full max-w-3xl font-mono text-[11px] tracking-[0.2em] text-accent">
          PASO {tabIndex + 1} DE {TABS.length} · {TABS[tabIndex].label.toUpperCase()}
        </p>
        {USES_MESSAGE[tab](screen) && <MessageBanner />}
        <AnimatePresence mode="wait">
          <motion.div key={`${tab}-${screen}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Screen />
          </motion.div>
        </AnimatePresence>
        <StepControls />
      </div>
    </div>
  );
}
