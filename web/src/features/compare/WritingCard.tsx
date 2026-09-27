/** Ilustración de un modelo que escribe su respuesta palabra por palabra (texto de ejemplo, no es una respuesta real). */
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { useTypewriter } from './useTypewriter';

type Props = { question: string; message: string; answerLabel: string; replay: number };

export function WritingCard({ question, message, answerLabel, replay }: Props) {
  const essay = `El cliente escribió «${message}». Por lo que pide, este mensaje debería atenderlo el área de ${answerLabel}. Aunque podría tener que ver con otra área, esa parece la más adecuada. Antes de responderle, convendría revisar…`;
  const typing = useTypewriter(essay, replay);
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <Eyebrow>ESCRIBE · COMO CHATGPT</Eyebrow>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-muted">ilustración, texto de ejemplo</span>
      </div>
      <p className="mb-2 text-sm text-ink/70">{question}</p>
      <p className="min-h-[8.5rem] text-[15px] leading-relaxed text-ink/85">
        {typing.visible}
        {!typing.done && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-ink/70 align-middle" />}
      </p>
      <p className="mt-4 border-t border-line pt-3 font-mono text-[11px] text-muted">palabras escritas: <span className="text-ink">{typing.written}</span> · una tras otra</p>
    </Card>
  );
}
