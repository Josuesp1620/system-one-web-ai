/** Paso 3 · Qué palabras decidieron: pistas (solas llevan a la respuesta) e imprescindibles (sin ellas se cae),
 * medidas volviendo a preguntar a Laya. */
import { QuestionControl } from '../../components/decision/QuestionControl';
import { Card } from '../../components/ui/Card';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import { answerReader } from '../../data/answers';
import { format } from '../../data/format';
import { palette } from '../../data/palette';
import { useAppState } from '../../state/AppState';
import { ImportanceVerdict } from './ImportanceVerdict';
import { RatedMessage } from './RatedMessage';
import { WordLists } from './WordLists';
import { wordRoles } from './wordRoles';

export function ImportanceScreen() {
  const { decision, inspection } = useAppState();
  if (!decision || !inspection) return null;
  const importance = decision.importance;
  const answer = decision.decision.options[importance.option].label;
  const words = wordRoles.rate(importance);
  const isCorrect = answerReader.isCorrect(decision.decision, decision.probabilities, inspection.correct[decision.decision.id]);
  return (
    <ScreenFrame title="¿Qué palabras decidieron?" control={<QuestionControl />}
      sentence={<>Laya respondió <b style={{ color: palette.option(importance.option) }}>«{answer}»</b> con {format.percent(importance.baseline)}{isCorrect ? '' : ' (y se equivocó)'}. Para saber por qué, le volvimos a preguntar con cada palabra sola y sin cada palabra.</>}>
      <Card>
        <RatedMessage words={words} answer={answer} />
        <div className="mt-5"><WordLists words={words} baseline={importance.baseline} answer={answer} /></div>
        <ImportanceVerdict importance={importance} decision={decision.decision} words={words} answer={answer} />
      </Card>
    </ScreenFrame>
  );
}
