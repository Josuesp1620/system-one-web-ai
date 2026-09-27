/** Paso 2 · El mensaje entra por la izquierda y, en una sola pasada, salen las tres respuestas con sus porcentajes. */
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { useAppState } from '../../state/AppState';
import { DecisionCard } from './DecisionCard';
import { FlowLines } from './FlowLines';

export function DecisionsScreen() {
  const { inspection, decisionIndex, setDecisionIndex } = useAppState();
  if (!inspection) return null;
  return (
    <ScreenFrame title="Tres respuestas de una vez" sentence="Con una sola lectura del mensaje, Laya responde tres preguntas a la vez. Cada tarjeta muestra su respuesta, el porcentaje de cada alternativa y si acertó, comparando con la respuesta correcta que trae el mensaje.">
      <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
        <Card className="md:w-[260px] md:shrink-0">
          <Eyebrow>MENSAJE DEL CLIENTE</Eyebrow>
          <p className="mt-3 text-lg leading-relaxed text-message">«{inspection.text}»</p>
          <p className="mt-4 border-t border-line pt-3 font-mono text-[11px] text-muted">{inspection.tokensTotal} tokens de entrada · <span className="text-ink">0 generados</span></p>
        </Card>
        <FlowLines count={inspection.decisions.length} />
        <div className="flex-1 space-y-3">
          {inspection.decisions.map((item, index) => (
            <DecisionCard key={item.decision.id} item={item} correctKey={inspection.correct[item.decision.id]}
              selected={index === decisionIndex} onSelect={() => setDecisionIndex(index)} />
          ))}
        </div>
      </div>
    </ScreenFrame>
  );
}
