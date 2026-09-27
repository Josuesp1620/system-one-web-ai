/** Técnico 1 · Tokens: la fila real que arma Laya para la pregunta elegida, separada en sus tres partes. */
import { MessageBanner } from '../../components/decision/MessageBanner';
import { QuestionControl } from '../../components/decision/QuestionControl';
import { ScreenFrame } from '../../components/ui/ScreenFrame';
import type { Token } from '../../data/types';
import { useAppState } from '../../state/AppState';
import { TokenChip } from './TokenChip';
import { TokenSegment } from './TokenSegment';

class RowSegments {
  question(tokens: Token[]): Token[] {
    return tokens.filter((token) => token.role === 'question');
  }

  alternatives(tokens: Token[]): Token[][] {
    const groups: Token[][] = [];
    for (const token of tokens) {
      if (token.role === 'marker') groups.push([token]);
      else if (token.role === 'option') groups[groups.length - 1]?.push(token);
    }
    return groups;
  }

  message(tokens: Token[]): Token[] {
    return tokens.filter((token) => token.role === 'message');
  }
}

const segments = new RowSegments();

export function TokensScreen() {
  const { decision, inspection } = useAppState();
  if (!decision || !inspection) return null;
  const alternatives = segments.alternatives(decision.tokens);
  return (
    <>
    <MessageBanner />
    <ScreenFrame title="Así lee: tokens" control={<QuestionControl />}
      sentence={<>No lee letras sino <b>tokens</b> (pedazos de palabra). Por cada pregunta arma una fila de tres partes ({decision.tokens.length} tokens). Las partes 1 y 2 las definimos nosotros y son <b>iguales para cualquier mensaje</b>; solo la parte 3 cambia.</>}>
      <div className="space-y-3">
        <TokenSegment number={1} title="La pregunta" note="fija · Laya le antepone el tipo («choice question»: elegir una opción)">{segments.question(decision.tokens).map((token, index) => <TokenChip key={index} token={token} />)}</TokenSegment>
        <TokenSegment number={2} title="Las alternativas" note={`fijas · ${alternatives.length}, cada una empieza con un marcador <mask> donde se leen sus puntos`}>
          {alternatives.map((group, groupIndex) => (
            <span key={groupIndex} className="mr-3 inline-flex flex-wrap items-center">{group.map((token, index) => <TokenChip key={index} token={token} />)}</span>
          ))}
        </TokenSegment>
        <TokenSegment number={3} title="El mensaje del cliente" note="cambia con cada mensaje">{segments.message(decision.tokens).map((token, index) => <TokenChip key={index} token={token} />)}</TokenSegment>
      </div>
      <p className="mt-3 text-sm text-muted">Pasa el mouse por un token para ver su texto exacto. Una palabra puede partirse en varios tokens.</p>
    </ScreenFrame>
    </>
  );
}
