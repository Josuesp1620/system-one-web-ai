/** Técnico · Atención: hacia dónde mira el marcador de una alternativa, en promedio y capa por capa. */
import { MessageBanner } from '../../components/decision/MessageBanner';
import { OptionPills } from '../../components/decision/OptionPills';
import { QuestionControl } from '../../components/decision/QuestionControl';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { palette } from '../../data/palette';
import { messageWords } from '../../data/words';
import { useAppState } from '../../state/AppState';
import { HighlightedMessage } from '../attention/HighlightedMessage';
import { LayerHeatmap } from './LayerHeatmap';

export function AttentionTechScreen() {
  const { decision, option, modelCard } = useAppState();
  if (!decision) return null;
  const color = palette.option(option);
  const layers = decision.attention.messageByLayer[option].map((weights) => messageWords.group(decision.tokens, weights));
  return (
    <>
      <MessageBanner />
      <ScreenFrame title="Hacia dónde mira" control={<div className="space-y-3"><QuestionControl /><OptionPills /></div>}
        sentence={<>La <b>atención</b> indica cuánto mira el modelo cada palabra al evaluar una alternativa. Se reparte entre toda la fila (pregunta, alternativas y mensaje), por eso los porcentajes son pequeños. Muestra hacia dónde mira, no qué palabra fue decisiva; eso está en «Palabras clave».</>}>
        <HighlightedMessage words={messageWords.group(decision.tokens, decision.attention.globalAverage[option])} color={color} caption="PROMEDIO DE LAS CAPAS QUE LEEN TODO" labeledCount={3} />
        <p className="mb-2 mt-6 text-sm text-muted">Capa por capa ({modelCard.layers} capas, de arriba hacia abajo; en <span className="text-accent">dorado</span>, las que leen todo el texto):</p>
        <div className="glass rounded-2xl p-4"><LayerHeatmap layers={layers} globalLayers={modelCard.globalLayers} toMessage={decision.attention.toMessageByLayer[option]} color={color} /></div>
      </ScreenFrame>
    </>
  );
}
