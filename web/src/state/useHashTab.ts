/** La pestaña activa, sincronizada con el # de la dirección (enlaces directos y botón atrás). */
import { useEffect, useState } from 'react';
import { isTabId, type TabId } from './tabs';

export function useHashTab(fallback: TabId): [TabId, (tab: TabId) => void] {
  const initial = window.location.hash.slice(1);
  const [tab, setTab] = useState<TabId>(isTabId(initial) ? initial : fallback);

  useEffect(() => {
    history.replaceState(null, '', `#${tab}`);
  }, [tab]);

  useEffect(() => {
    const followHash = () => {
      const hash = window.location.hash.slice(1);
      if (isTabId(hash)) setTab(hash);
    };
    window.addEventListener('hashchange', followHash);
    return () => window.removeEventListener('hashchange', followHash);
  }, []);

  return [tab, setTab];
}
