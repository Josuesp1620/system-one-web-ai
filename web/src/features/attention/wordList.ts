/** Une palabras en español: «a», «a» y «b», «a», «b» y «c». */
class SpanishList {
  join(items: string[]): string {
    if (items.length <= 1) return items[0] ?? '';
    return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
  }

  quote(words: string[]): string {
    return this.join(words.map((word) => `«${word.replace(/[.,:;¿?¡!]/g, '')}»`));
  }
}

export const spanishList = new SpanishList();
