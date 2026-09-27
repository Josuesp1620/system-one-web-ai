/** Técnico 4 · De dónde salen los mensajes y cómo está hecho Laya. */
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { DatasetDetails } from './DatasetDetails';

export function DatasetScreen() {
  return <ScreenFrame title="Los datos y el modelo" sentence="De dónde salen los mensajes y la ficha técnica de Laya."><DatasetDetails /></ScreenFrame>;
}
