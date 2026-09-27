/** Tabla de calor: fila = capa del modelo, columna = palabra del mensaje, brillo = cuánto la miró el marcador. */
import { format } from '../../data/format';
import type { WeightedWord } from '../../data/words';

type Props = { layers: WeightedWord[][]; globalLayers: number[]; toMessage: number[]; color: string };

export function LayerHeatmap({ layers, globalLayers, toMessage, color }: Props) {
  const strongest = Math.max(...layers.flat().map((word) => word.weight), 1e-6);
  const words = layers[0]?.map((word) => word.text) ?? [];
  return (
    <div className="thin-scroll overflow-x-auto">
      <table className="border-separate border-spacing-[2px] text-[11px]">
        <thead>
          <tr><th />{words.map((word, index) => <th key={index} className="px-1 pb-1 font-normal text-ink/80">{word}</th>)}<th className="pl-2 text-left font-normal text-muted">al mensaje</th></tr>
        </thead>
        <tbody>
          {layers.map((row, layer) => (
            <tr key={layer}>
              <th className={`whitespace-nowrap pr-2 text-right font-mono font-normal ${globalLayers.includes(layer) ? 'text-accent' : 'text-muted'}`}>capa {layer + 1}</th>
              {row.map((word, index) => (
                <td key={index} title={`capa ${layer + 1} · «${word.text}» · ${format.percent(word.weight, 1)}`} className="h-5 min-w-8 rounded-[3px]"
                  style={{ background: `${color}${Math.round(Math.min(1, word.weight / strongest) * 255).toString(16).padStart(2, '0')}` }} />
              ))}
              <td className="pl-2 font-mono text-muted">{format.percent(toMessage[layer])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
