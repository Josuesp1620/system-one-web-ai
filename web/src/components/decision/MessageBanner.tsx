/** Franja con el mensaje del cliente que se está analizando, para que cada pantalla diga de qué mensaje habla. */
import { useAppState } from '../../state/AppState';

export function MessageBanner() {
  const { inspection } = useAppState();
  if (!inspection) return null;
  return (
    <div className="mx-auto mb-6 w-full max-w-3xl rounded-xl border border-message/25 bg-message/[0.06] px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">El cliente escribió</p>
      <p className="mt-1 text-lg text-message">«{inspection.text}»</p>
    </div>
  );
}
