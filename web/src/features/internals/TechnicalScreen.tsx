/** Técnico: muestra la vista elegida en el panel lateral. */
import { useAppState } from '../../state/AppState';
import { AttentionTechScreen } from './AttentionTechScreen';
import { DatasetScreen } from './DatasetScreen';
import { ModelsScreen } from './ModelsScreen';
import { TokensScreen } from './TokensScreen';

const VIEWS = { tokens: TokensScreen, attention: AttentionTechScreen, models: ModelsScreen, dataset: DatasetScreen };

export function TechnicalScreen() {
  const { technicalView } = useAppState();
  const View = VIEWS[technicalView];
  return <View />;
}
