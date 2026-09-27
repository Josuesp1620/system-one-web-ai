/** El cuerpo de la app: la pantalla del recorrido sobre el fondo de estrellas y el panel lateral del paso. */
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { Stage } from '../scene/Stage';
import { useAppState } from '../state/AppState';
import { GuidedView } from './GuidedView';
import { Sidebar } from './Sidebar';

export function Workspace() {
  const { loading, tab } = useAppState();
  return (
    <main className="relative flex min-h-0 flex-1 flex-col md:flex-row">
      <div className="relative min-h-[60vh] flex-1">
        <Stage />
        <GuidedView />
        {loading && <LoadingOverlay text="Cargando el análisis de este mensaje…" />}
      </div>
      <Sidebar tab={tab} />
    </main>
  );
}
