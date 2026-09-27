/** Un token como pastilla de color; al pasar el mouse muestra su papel. */
import { palette } from '../../data/palette';
import { messageWords } from '../../data/words';
import type { Token } from '../../data/types';

const ROLE_NAMES = { cls: 'inicio', separator: 'separador', question: 'pregunta', marker: 'marcador', option: 'alternativa', message: 'mensaje' };

export function TokenChip({ token }: { token: Token }) {
  const isMarker = token.role === 'marker';
  const color = isMarker ? palette.option(token.option) : palette.roles[token.role];
  const text = messageWords.clean(token.text) || token.text;
  return (
    <span title={`${ROLE_NAMES[token.role]} · «${token.text}»`}
      className={`inline-block rounded px-1.5 py-0.5 font-mono text-[12px] leading-none ${token.text.startsWith('▁') ? 'ml-1' : ''}`}
      style={isMarker ? { background: color, color: '#0b0d12', fontWeight: 600 } : { color, background: `${color}14` }}>
      {text}
    </span>
  );
}
