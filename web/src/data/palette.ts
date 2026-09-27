/** Colores de la interfaz para los datos: uno por alternativa (se repiten si hay más de 12) y uno por papel del token. */
import type { TokenRole } from './types';

class Palette {
  readonly options = ['#5ee0f0', '#f47ab8', '#9ae6b4', '#fdba74', '#a78bfa', '#f7c948', '#7dd3fc', '#fca5a5', '#86efac', '#c4b5fd', '#fcd34d', '#67e8f9'];
  readonly roles: Record<TokenRole, string> = {
    cls: '#5b6272', separator: '#5b6272', question: '#a78bfa', marker: '#f7c948', option: '#c9ccd6', message: '#5ee0f0',
  };
  readonly muted = '#3a4152';

  option(index: number): string {
    return this.options[index % this.options.length];
  }
}

export const palette = new Palette();
