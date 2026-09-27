/** Las pantallas de cada paso del recorrido, en orden. */
import type { ComponentType } from 'react';
import { ImportanceScreen } from '../features/attention/ImportanceScreen';
import { CompareScreen } from '../features/compare/CompareScreen';
import { DifferenceScreen } from '../features/decide/DifferenceScreen';
import { PercentScreen } from '../features/decide/PercentScreen';
import { PointsScreen } from '../features/decide/PointsScreen';
import { TechnicalScreen } from '../features/internals/TechnicalScreen';
import { DecisionsScreen } from '../features/message/DecisionsScreen';
import { AccuracyScreen } from '../features/study/AccuracyScreen';
import { ConfusionScreen } from '../features/study/ConfusionScreen';
import { ExamplesScreen } from '../features/study/ExamplesScreen';
import { HonestyScreen } from '../features/study/HonestyScreen';
import { RuleScreen } from '../features/trust/RuleScreen';
import { TradeoffScreen } from '../features/trust/TradeoffScreen';
import type { TabId } from '../state/tabs';

export const SCREENS: Record<TabId, ComponentType[]> = {
  compare: [CompareScreen],
  message: [DecisionsScreen],
  attention: [ImportanceScreen],
  decide: [PointsScreen, DifferenceScreen, PercentScreen],
  trust: [RuleScreen, TradeoffScreen],
  study: [AccuracyScreen, HonestyScreen, ConfusionScreen, ExamplesScreen],
  internals: [TechnicalScreen],
};

/** Qué pantallas trabajan sobre el mensaje elegido (las demás usan los 540 mensajes medidos o son generales). */
export const USES_MESSAGE: Record<TabId, (screen: number) => boolean> = {
  compare: () => true,
  message: () => false,          // esta pantalla ya muestra el mensaje en su propio gráfico
  attention: () => true,
  decide: () => true,
  trust: () => false,
  study: () => false,
  internals: () => false,        // sus vistas muestran el mensaje ellas mismas, cuando lo usan
};
