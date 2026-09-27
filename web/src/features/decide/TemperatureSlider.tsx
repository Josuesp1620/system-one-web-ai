/** Control «qué tan tajante»: cambia la temperatura del softmax sobre los mismos puntos (simulación). */
import { Slider } from '../../components/ui/Slider';
import { useAppState } from '../../state/AppState';

const DESCRIPTIONS = [
  { upTo: 0.9, text: 'muy tajante' },
  { upTo: 1.1, text: 'como el modelo' },
  { upTo: 3, text: 'más prudente' },
  { upTo: Infinity, text: 'muy prudente' },
];

export function TemperatureSlider() {
  const { decision, temperature, setTemperature } = useAppState();
  if (!decision) return null;
  const value = temperature ?? decision.temperature;
  const describe = (current: number) => DESCRIPTIONS.find((description) => current < description.upTo || description.upTo === Infinity)!.text;
  return (
    <>
      <Slider id="temperature" label="Qué tan tajante (temperatura)" value={value} min={0.25} max={6} step={0.05} onChange={setTemperature} display={describe} />
      {temperature !== null && <button onClick={() => setTemperature(null)} className="text-xs text-message hover:underline">Volver al valor del modelo</button>}
    </>
  );
}
