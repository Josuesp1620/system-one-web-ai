/** Panel lateral con todos los mensajes de ejemplo (Bitext): se elige uno y todo el recorrido lo usa. */
import { useAppState } from '../../state/AppState';

const AREA_NAMES: Record<string, string> = {
  ACCOUNT: 'cuenta', CANCEL: 'cancelación', CONTACT: 'contacto', DELIVERY: 'entrega', FEEDBACK: 'opinión o queja', INVOICE: 'factura',
  ORDER: 'pedido', PAYMENT: 'pago', REFUND: 'reembolso', SHIPPING: 'dirección de envío', SUBSCRIPTION: 'boletín',
};

export function MessageList() {
  const { showcase, messageId, setMessage } = useAppState();
  return (
    <div className="px-5 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Mensajes de ejemplo</p>
      <p className="mt-1 text-xs text-muted">Del conjunto Bitext en español. Elige uno: todo el recorrido lo usa.</p>
      <div className="mt-4 space-y-1.5">
        {showcase.map((entry) => (
          <button key={entry.id} onClick={() => setMessage(entry.id)}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-left transition ${messageId === entry.id ? 'border-ink/70 bg-white/[0.06]' : 'border-line hover:border-white/25'}`}>
            <span className="block text-sm leading-snug">«{entry.text}»</span>
            <span className="mt-1 block text-xs text-muted">área correcta: {AREA_NAMES[entry.correct.area] ?? entry.correct.area}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
