/**
 * Carga los datos de public/data. El laboratorio escribe las claves en snake_case (convención de Python) y la web
 * las usa en camelCase: la conversión se hace aquí, en un solo lugar.
 */
import type { Inspection, ModelCard, ShowcaseEntry, Study } from './types';

class KeyCaseConverter {
  toCamel(value: unknown): unknown {
    if (Array.isArray(value)) return value.map((item) => this.toCamel(item));
    if (value === null || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [this.camelKey(key), this.toCamel(item)]));
  }

  camelKey(key: string): string {
    return key.replace(/_([a-z0-9])/g, (match, letter: string) => letter.toUpperCase());
  }
}

class DataClient {
  private readonly converter = new KeyCaseConverter();
  private readonly cache = new Map<string, Promise<unknown>>();

  modelCard(): Promise<ModelCard> {
    return this.load('/data/model.json') as Promise<ModelCard>;
  }

  showcase(): Promise<ShowcaseEntry[]> {
    return this.load('/data/showcase/index.json') as Promise<ShowcaseEntry[]>;
  }

  inspection(messageId: string): Promise<Inspection> {
    return this.load(`/data/showcase/${messageId}.json`) as Promise<Inspection>;
  }

  study(): Promise<Study> {
    return this.load('/data/study.json') as Promise<Study>;
  }

  private load(path: string): Promise<unknown> {
    if (!this.cache.has(path)) this.cache.set(path, this.fetchJson(path));
    return this.cache.get(path)!;
  }

  private async fetchJson(path: string): Promise<unknown> {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`No se pudo cargar ${path} (${response.status})`);
    return this.converter.toCamel(await response.json());
  }
}

export const dataClient = new DataClient();
