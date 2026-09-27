/** Deslizador con su etiqueta y el valor actual ya formateado. */
type Props = {
  id: string; label: string; value: number; min: number; max: number; step?: number;
  onChange: (value: number) => void; display: (value: number) => string;
};

export function Slider({ id, label, value, min, max, step = 1, onChange, display }: Props) {
  const filled = ((value - min) / (max - min)) * 100;
  return (
    <label htmlFor={id} className="block">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink/80">{label}</span>
        <span className="font-mono text-sm font-semibold tabular-nums">{display(value)}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))}
        className="range w-full" style={{ ['--filled' as string]: `${filled}%` }} />
    </label>
  );
}
