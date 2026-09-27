/** Técnico 3 · Jev, Kev y Laya: hacen lo mismo, pero por dentro leen distinto. */
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { ModelCards } from './ModelCards';

export function ModelsScreen() {
  return <ScreenFrame title="Jev, Kev y Laya" sentence="Los tres eligen alternativas con porcentajes; por dentro leen distinto."><ModelCards /></ScreenFrame>;
}
