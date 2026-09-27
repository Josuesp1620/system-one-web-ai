/** El panel lateral de cada paso: la lista de mensajes donde se usa el mensaje elegido, las opciones en «Técnico»,
 * y nada en los pasos que miden los 540 mensajes (Confianza y Caso de estudio). */
import type { ReactNode } from 'react';
import { MessageList } from '../components/layout/MessageList';
import { TechnicalPanel } from '../features/internals/TechnicalPanel';
import type { TabId } from '../state/tabs';

const MESSAGE_TABS: TabId[] = ['compare', 'message', 'attention', 'decide'];

export function Sidebar({ tab }: { tab: TabId }) {
  if (tab === 'internals') return <Frame><TechnicalPanel /></Frame>;
  if (MESSAGE_TABS.includes(tab)) return <Frame><MessageList /></Frame>;
  return null;
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <aside className="thin-scroll max-h-[40vh] overflow-y-auto border-t border-line bg-panel md:max-h-none md:w-[340px] md:border-l md:border-t-0">
      {children}
    </aside>
  );
}
