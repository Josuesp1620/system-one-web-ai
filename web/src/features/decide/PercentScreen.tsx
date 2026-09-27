/** Paso 4.3 · Los puntos se vuelven porcentajes; el control muestra qué tan tajante es esa conversión. */
import { Card } from '../../components/ui/Card';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { probabilityMath } from '../../data/probability';
import { useAppState } from '../../state/AppState';
import { PercentResult } from './PercentResult';
import { TemperatureSlider } from './TemperatureSlider';

export function PercentScreen() {
  const { decision, temperature } = useAppState();
  if (!decision) return null;
  const probabilities = probabilityMath.softmax(decision.logits, temperature ?? decision.temperature);
  return (
    <ScreenFrame title="Al final, porcentajes" sentence="La fórmula convierte los puntos en porcentajes que suman 100 %. El control no cambia los puntos: solo cambia cuánto se lleva la primera frente a las demás. Es una simulación; Laya usa el valor «como el modelo»."
      control={<div className="space-y-4"><p className="text-sm">Pregunta: <b>{decision.decision.question}</b></p><TemperatureSlider /></div>}>
      <Card className="mx-auto max-w-xl"><PercentResult decision={decision.decision} probabilities={probabilities} /></Card>
    </ScreenFrame>
  );
}
