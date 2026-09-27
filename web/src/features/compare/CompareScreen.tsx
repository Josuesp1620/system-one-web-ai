/** Paso 1 · Dos formas de responder: escribir (ilustración) frente a marcar alternativas (Laya, respuesta real). */
import { useState } from 'react';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { probabilityMath } from '../../data/probability';
import { useAppState } from '../../state/AppState';
import { MarkingCard } from './MarkingCard';
import { WritingCard } from './WritingCard';

export function CompareScreen() {
  const { inspection } = useAppState();
  const [replay, setReplay] = useState(0);
  const area = inspection?.decisions[0];
  if (!inspection || !area) return null;
  const winnerLabel = area.decision.options[probabilityMath.winner(area.probabilities)].label;
  return (
    <ScreenFrame title="Escribir o elegir" sentence={<>Las dos formas responden la misma pregunta sobre el mismo mensaje: <b>{area.decision.question}</b> ChatGPT escribiría un texto, palabra por palabra. Laya, un modelo System One, solo marca una de las alternativas y dice qué tan seguro está de cada una.</>}>
      <div className="grid gap-4 md:grid-cols-2">
        <WritingCard question={area.decision.question} message={inspection.text} answerLabel={winnerLabel} replay={replay} />
        <MarkingCard item={area} correctKey={inspection.correct.area} />
      </div>
      <button onClick={() => setReplay((count) => count + 1)} className="mt-4 text-sm text-message hover:underline">↻ Ver de nuevo</button>
    </ScreenFrame>
  );
}
