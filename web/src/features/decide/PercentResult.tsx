/** Paso 3: los porcentajes finales, en una barra que suma 100 % y la lista de las más probables. */
import { motion } from 'motion/react';
import { ProbabilityBars } from '../../components/decision/ProbabilityBars';
import { palette } from '../../data/palette';
import type { DecisionInfo } from '../../data/types';

export function PercentResult({ decision, probabilities }: { decision: DecisionInfo; probabilities: number[] }) {
  return (
    <>
      <div className="flex h-8 overflow-hidden rounded-lg">
        {probabilities.map((probability, index) => (
          <motion.div key={index} className="h-full" style={{ background: palette.option(index) }} animate={{ width: `${probability * 100}%` }} transition={{ duration: 0.4 }} />
        ))}
      </div>
      <div className="mt-3"><ProbabilityBars decision={decision} probabilities={probabilities} limit={3} /></div>
    </>
  );
}
