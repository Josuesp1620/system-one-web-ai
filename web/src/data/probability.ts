/** Cuentas sobre probabilidades. La única cuenta propia de la web es el softmax con otra temperatura (pestaña
 * «Cómo decide»), hecho sobre los logits reales y marcado como simulación. */
class ProbabilityMath {
  softmax(logits: number[], temperature: number): number[] {
    const scaled = logits.map((logit) => logit / temperature);
    const highest = Math.max(...scaled);
    const exponentials = scaled.map((value) => Math.exp(value - highest));
    const total = exponentials.reduce((sum, value) => sum + value, 0);
    return exponentials.map((value) => value / total);
  }

  winner(probabilities: number[]): number {
    return probabilities.indexOf(Math.max(...probabilities));
  }

  /** Las posiciones de las alternativas ordenadas de mayor a menor probabilidad. */
  ranking(probabilities: number[]): number[] {
    return probabilities.map((probability, index) => index).sort((first, second) => probabilities[second] - probabilities[first]);
  }
}

export const probabilityMath = new ProbabilityMath();
