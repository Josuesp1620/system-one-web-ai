/** Agrupa los tokens del mensaje en palabras (el tokenizador marca el inicio de palabra con «▁»). */
import type { Token } from './types';

export type WeightedWord = { text: string; weight: number };

class MessageWords {
  /** `weights` va por token del mensaje, en el mismo orden en que aparecen. */
  group(tokens: Token[], weights: number[]): WeightedWord[] {
    const words: WeightedWord[] = [];
    let messageIndex = 0;
    for (const token of tokens) {
      if (token.role !== 'message') continue;
      const weight = weights[messageIndex++] ?? 0;
      const startsWord = token.text.startsWith('▁') || words.length === 0;
      if (startsWord) words.push({ text: this.clean(token.text), weight });
      else this.extend(words[words.length - 1], token.text, weight);
    }
    return words;
  }

  top(words: WeightedWord[], count: number): WeightedWord[] {
    return [...words].sort((first, second) => second.weight - first.weight).slice(0, count);
  }

  clean(piece: string): string {
    return piece.replaceAll('▁', ' ').trim();
  }

  private extend(word: WeightedWord, piece: string, weight: number): void {
    word.text += piece;
    word.weight += weight;
  }
}

export const messageWords = new MessageWords();
