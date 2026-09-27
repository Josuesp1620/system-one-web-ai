/** Convierte un punto de la curva de automatización en «de cada 100 mensajes». */
import type { CoveragePoint } from '../../data/types';
import type { HundredSplit } from './HundredGrid';

class PerHundred {
  split(point: CoveragePoint): HundredSplit {
    const automated = Math.round(point.coverage * 100);
    const right = Math.round(point.coverage * (point.accuracy ?? 0) * 100);
    return { right, wrong: automated - right, person: 100 - automated };
  }
}

export const perHundred = new PerHundred();
