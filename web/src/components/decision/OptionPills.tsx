/** Elige una alternativa de la decisión actual. Con muchas alternativas solo muestra las más probables. */
import { palette } from '../../data/palette';
import { probabilityMath } from '../../data/probability';
import { useAppState } from '../../state/AppState';
import { Pills } from '../ui/Pills';

export function OptionPills({ limit = 6 }: { limit?: number }) {
  const { decision, option, setOption } = useAppState();
  if (!decision) return null;
  const shown = probabilityMath.ranking(decision.probabilities).slice(0, limit);
  if (!shown.includes(option)) shown.push(option);
  return (
    <Pills value={option} onChange={setOption}
      pills={shown.map((index) => ({ value: index, label: decision.decision.options[index].label, color: palette.option(index) }))} />
  );
}
