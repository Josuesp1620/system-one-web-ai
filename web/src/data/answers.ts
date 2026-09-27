/** Cómo se lee la respuesta de una decisión: siempre la alternativa que ganó, con su porcentaje. */
import { format } from './format';
import { probabilityMath } from './probability';
import type { DecisionInfo } from './types';

class AnswerReader {
  label(decision: DecisionInfo, key: string): string {
    return decision.options.find((option) => option.key === key)?.label ?? key;
  }

  winnerText(decision: DecisionInfo, probabilities: number[]): string {
    const winner = probabilityMath.winner(probabilities);
    return `${decision.options[winner].label} ${format.percent(probabilities[winner])}`;
  }

  isCorrect(decision: DecisionInfo, probabilities: number[], correctKey: string | undefined): boolean {
    return decision.options[probabilityMath.winner(probabilities)].key === correctKey;
  }
}

export const answerReader = new AnswerReader();
