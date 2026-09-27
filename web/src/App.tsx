/** Raíz: carga los datos y arma la app (encabezado + espacio de trabajo). */
import { Workspace } from './app/Workspace';
import { Header } from './components/layout/Header';
import { AppStateProvider } from './state/AppState';
import { useStaticData } from './state/useStaticData';

export function App() {
  const { data, error } = useStaticData();
  if (!data) return <LoadingScreen error={error} />;
  return (
    <AppStateProvider data={data}>
      <div className="flex h-full flex-col">
        <Header />
        <Workspace />
      </div>
    </AppStateProvider>
  );
}

function LoadingScreen({ error }: { error: string | null }) {
  return (
    <div className="grid h-full place-items-center text-center">
      <div className="flex flex-col items-center gap-5">
        <div className="font-display text-4xl font-extrabold">SYSTEM ONE</div>
        {!error && <span className="h-14 w-14 animate-spin rounded-full border-4 border-white/15 border-t-accent" aria-hidden />}
        <div className="text-lg text-muted">{error ?? 'Cargando los datos reales de Laya…'}</div>
      </div>
    </div>
  );
}
