/** Clasifica las palabras del mensaje según las dos mediciones reales: pistas (solas ya llevan a la respuesta) e
 * imprescindibles (sin ellas, la seguridad baja mucho). */
import type { WordImportance } from '../../data/types';

export type WordRole = 'essential' | 'clue' | 'essential-clue' | 'none';
export type RatedWord = { text: string; role: WordRole; without: number; alone: number };

class WordRoles {
  readonly essentialDrop = 0.15;   // baja al menos 15 puntos sin la palabra
  readonly clueAlone = 0.5;        // sola, al menos 50 % en la misma respuesta

  rate(importance: WordImportance): RatedWord[] {
    return importance.words.map((word) => ({ ...word, role: this.role(importance.baseline, word.without, word.alone) }));
  }

  role(baseline: number, without: number, alone: number): WordRole {
    const essential = baseline - without >= this.essentialDrop;
    const clue = alone >= this.clueAlone;
    if (essential && clue) return 'essential-clue';
    if (essential) return 'essential';
    if (clue) return 'clue';
    return 'none';
  }
}

export const wordRoles = new WordRoles();
