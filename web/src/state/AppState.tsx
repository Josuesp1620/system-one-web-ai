/**
 * Estado compartido de la app: pestaña, mensaje elegido, decisión, alternativa y los controles de cada pestaña.
 * Los datos estáticos (ficha del modelo, mensajes, caso de estudio) se cargan una vez y llegan por aquí.
 */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { probabilityMath } from '../data/probability';
import type { InspectedDecision, Inspection, ModelCard, ShowcaseEntry, Study } from '../data/types';
import type { TabId, TechnicalView } from './tabs';
import { useHashTab } from './useHashTab';
import { useInspection } from './useInspection';

export type StaticData = { modelCard: ModelCard; showcase: ShowcaseEntry[]; study: Study };

function useAppStateValue(data: StaticData) {
  const [tab, setTabValue] = useHashTab('compare');
  const [screen, setScreen] = useState(0);
  const [messageId, setMessageId] = useState(data.showcase[0]?.id ?? null);
  const [decisionIndex, setDecisionIndexValue] = useState(0);
  const [chosenOption, setChosenOption] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [threshold, setThreshold] = useState(0.9);
  const [studyRun, setStudyRun] = useState(Object.keys(data.study.runs)[0]);
  const [studyDecision, setStudyDecision] = useState('area');
  const [technicalView, setTechnicalView] = useState<TechnicalView>('tokens');
  const { inspection, loading } = useInspection(messageId);

  const decision: InspectedDecision | null = inspection?.decisions[decisionIndex] ?? null;
  const option = decision ? chosenOption ?? probabilityMath.winner(decision.probabilities) : 0;

  const setDecisionIndex = (index: number) => {
    setDecisionIndexValue(index);
    setChosenOption(null);
    setTemperature(null);
  };
  const setTab = (next: TabId, nextScreen = 0) => {
    setTabValue(next);
    setScreen(nextScreen);
  };
  const setMessage = (id: string) => {
    setMessageId(id);
    setChosenOption(null);
  };

  return {
    ...data,
    tab, setTab,
    screen, setScreen,
    messageId, setMessage,
    inspection: inspection as Inspection | null, loading,
    decisionIndex, setDecisionIndex, decision,
    option, setOption: setChosenOption,
    temperature, setTemperature,
    threshold, setThreshold,
    studyRun, setStudyRun,
    studyDecision, setStudyDecision,
    technicalView, setTechnicalView,
  };
}

export type AppState = ReturnType<typeof useAppStateValue>;
const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ data, children }: { data: StaticData; children: ReactNode }) {
  const value = useAppStateValue(data);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const state = useContext(AppStateContext);
  if (!state) throw new Error('useAppState se usó fuera de AppStateProvider');
  return state;
}
