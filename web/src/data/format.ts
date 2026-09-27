/** Formato de números para la interfaz (coma decimal, como se escribe en Perú). */
class Formatter {
  percent(value: number, decimals = 0): string {
    if (value > 0 && value < 0.001 && decimals <= 1) return '< 0,1 %';
    return `${(value * 100).toFixed(decimals).replace('.', ',')} %`;
  }

  number(value: number, decimals = 2): string {
    return value.toFixed(decimals).replace('.', ',');
  }

  integer(value: number): string {
    return value.toLocaleString('es-PE');
  }

  money(value: number): string {
    return `US$ ${value.toFixed(value < 0.1 ? 4 : 2).replace('.', ',')}`;
  }
}

export const format = new Formatter();
