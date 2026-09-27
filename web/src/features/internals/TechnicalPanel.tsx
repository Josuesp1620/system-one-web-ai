/** Panel lateral de «Técnico»: qué vista mirar y, si la vista usa el mensaje, la lista de mensajes. */
import { MessageList } from '../../components/layout/MessageList';
import { useAppState } from '../../state/AppState';
import type { TechnicalView } from '../../state/tabs';

const VIEWS: { value: TechnicalView; label: string; detail: string }[] = [
  { value: 'tokens', label: 'Cómo lee: tokens', detail: 'la fila que arma por cada pregunta' },
  { value: 'attention', label: 'Hacia dónde mira: atención', detail: 'por palabra y capa por capa' },
  { value: 'models', label: 'Jev, Kev y Laya', detail: 'en qué se diferencian' },
  { value: 'dataset', label: 'Los datos y el modelo', detail: 'limpieza y ficha técnica' },
];

export function TechnicalPanel() {
  const { technicalView, setTechnicalView } = useAppState();
  const usesMessage = technicalView === 'tokens' || technicalView === 'attention';
  return (
    <>
      <div className="px-5 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Qué ver</p>
        <div className="mt-3 space-y-1.5">
          {VIEWS.map((view) => (
            <button key={view.value} onClick={() => setTechnicalView(view.value)}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-left transition ${technicalView === view.value ? 'border-ink/70 bg-white/[0.06]' : 'border-line hover:border-white/25'}`}>
              <span className="block text-sm">{view.label}</span>
              <span className="mt-0.5 block text-xs text-muted">{view.detail}</span>
            </button>
          ))}
        </div>
      </div>
      {usesMessage && <MessageList />}
    </>
  );
}
