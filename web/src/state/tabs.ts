/** Las pestañas del recorrido, en orden. */
export const TABS = [
  { id: 'compare', label: 'Dos formas' },
  { id: 'message', label: 'Decisiones' },
  { id: 'attention', label: 'Palabras clave' },
  { id: 'decide', label: 'Puntos y %' },
  { id: 'trust', label: 'Confianza' },
  { id: 'study', label: 'Caso de estudio' },
  { id: 'internals', label: 'Técnico' },
] as const;

export type TabId = (typeof TABS)[number]['id'];

export type TechnicalView = 'tokens' | 'attention' | 'models' | 'dataset';

export function isTabId(value: string): value is TabId {
  return TABS.some((tab) => tab.id === value);
}
