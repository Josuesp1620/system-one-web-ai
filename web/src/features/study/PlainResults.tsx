/** Los resultados de la medición en frases simples, una tarjeta por decisión. */
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import type { Run } from '../../data/types';

export function PlainResults({ run }: { run: Run }) {
  const area = run.decisions.area;
  const intent = run.decisions.intent;
  const complaint = run.decisions.complaint;
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {area && <ResultCard title="ÁREA · 11 OPCIONES" value={Math.round(area.accuracy * 100)} text="de cada 100 mensajes, acertó el área que debe atenderlo"
        detail={`${Math.round(area.accuracy * run.messages)} de ${run.messages} mensajes`} />}
      {intent && <ResultCard title="INTENCIÓN · 27 OPCIONES" value={Math.round(intent.accuracy * 100)} text="de cada 100 mensajes, acertó qué quiere hacer exactamente el cliente"
        detail={`${Math.round(intent.accuracy * run.messages)} de ${run.messages} mensajes`} />}
      {complaint?.positiveClass && <ComplaintCard recall={complaint.positiveClass.recall} precision={complaint.positiveClass.precision} actual={complaint.positiveClass.actualPositive} messages={run.messages} />}
    </div>
  );
}

function ResultCard({ title, value, text, detail }: { title: string; value: number; text: string; detail: string }) {
  return (
    <Card>
      <Eyebrow>{title}</Eyebrow>
      <p className="mt-2 font-display text-5xl font-extrabold text-positive">{value}</p>
      <p className="mt-1 text-sm text-ink/80">{text}</p>
      <p className="mt-2 font-mono text-xs text-muted">{detail}</p>
    </Card>
  );
}

function ComplaintCard({ recall, precision, actual, messages }: { recall: number | null; precision: number | null; actual: number; messages: number }) {
  return (
    <Card>
      <Eyebrow>¿ES UN RECLAMO? · SÍ O NO</Eyebrow>
      <p className="mt-2 font-display text-5xl font-extrabold text-message">{recall === null ? '—' : Math.round(recall * 100)}</p>
      <p className="mt-1 text-sm text-ink/80">reclamos detectados, de cada 100</p>
      <p className="mt-2 text-sm text-alert">Pero de cada 10 alertas de reclamo, solo {precision === null ? '—' : Math.round(precision * 10)} lo eran de verdad.</p>
      <p className="mt-2 font-mono text-xs text-muted">Había {actual} reclamos entre {messages} mensajes. Marca de más para no dejar pasar ninguno.</p>
    </Card>
  );
}
