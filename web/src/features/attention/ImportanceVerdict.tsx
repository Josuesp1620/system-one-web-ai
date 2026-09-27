/** La conclusión en una frase, según lo que muestran los datos de ese mensaje y esa pregunta. */
import { format } from '../../data/format';
import type { DecisionInfo, WordImportance } from '../../data/types';
import type { RatedWord } from './wordRoles';
import { spanishList } from './wordList';

const UNSURE_BELOW = 0.6;

type Props = { importance: WordImportance; decision: DecisionInfo; words: RatedWord[]; answer: string };

export function ImportanceVerdict({ importance, decision, words, answer }: Props) {
  const clues = words.filter((word) => word.role === 'clue' || word.role === 'essential-clue').map((word) => word.text);
  const essentials = words.filter((word) => word.role === 'essential' || word.role === 'essential-clue')
    .sort((first, second) => first.without - second.without).map((word) => word.text);
  const shares = spanishList.join(importance.top.map((item) => `${format.percent(item.probability)} a «${decision.options[item.option].label}»`));
  let text: string;
  if (importance.baseline < UNSURE_BELOW) {
    text = `Laya no estaba seguro: le dio ${shares}.`;
    if (clues.length) text += ` Por separado, ${spanishList.quote(clues)} sí apuntan con claridad a «${answer}», pero el resto del mensaje también apunta a otras áreas, y por eso duda.`;
  } else if (essentials.length) {
    text = `La respuesta depende de ${spanishList.quote(essentials.slice(0, 3))}: si se quita ${essentials.length > 1 ? 'cualquiera de ellas' : 'esa palabra'}, Laya ya no está seguro de «${answer}».`;
  } else if (clues.length > 1) {
    text = `Hay varias pistas (${spanishList.quote(clues)}). Si se quita una, las demás siguen apuntando a «${answer}»; por eso quitar palabras no cambia la respuesta.`;
  } else if (clues.length === 1) {
    text = `${spanishList.quote(clues)}, por sí sola, ya lleva a «${answer}», y el resto del mensaje también ayuda; por eso quitar una palabra no cambia la respuesta.`;
  } else {
    text = 'Ninguna palabra basta sola ni es imprescindible: la respuesta sale de la combinación de palabras.';
  }
  return <p className="mt-4 rounded-xl border border-accent/30 bg-accent/[0.06] px-4 py-3 text-[15px] leading-relaxed"><b className="text-accent">Conclusión:</b> {text}</p>;
}
