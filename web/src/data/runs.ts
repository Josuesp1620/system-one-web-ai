/** Nombres legibles de cada medición del caso de estudio y el punto de la curva más cercano a un umbral. */
import type { CoveragePoint, Run } from './types';

class RunReader {
  title(run: Run): string {
    const model = run.model.startsWith('laya') ? 'Laya' : `Kev ${run.model.replace('kev-', '').toUpperCase()}`;
    return `${model} · ${this.hardware(run)}`;
  }

  hardware(run: Run): string {
    return run.device === 'cpu' ? 'CPU' : run.device;
  }

  pointAt(curve: CoveragePoint[], threshold: number): CoveragePoint {
    return curve.reduce((closest, point) => (Math.abs(point.threshold - threshold) < Math.abs(closest.threshold - threshold) ? point : closest));
  }
}

export const runReader = new RunReader();
