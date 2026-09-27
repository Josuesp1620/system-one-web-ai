/** Fila de píldoras para elegir una opción (con un punto de color opcional). */
type Pill<Value> = { value: Value; label: string; color?: string };
type Props<Value> = { value: Value; pills: Pill<Value>[]; onChange: (value: Value) => void };

export function Pills<Value extends string | number>({ value, pills, onChange }: Props<Value>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {pills.map((pill) => (
        <button key={String(pill.value)} onClick={() => onChange(pill.value)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${value === pill.value ? 'border-ink/60 bg-white/10 text-ink' : 'border-line text-ink/70 hover:border-white/25 hover:text-ink'}`}>
          {pill.color && <span className="h-2 w-2 rounded-full" style={{ background: pill.color }} />}
          {pill.label}
        </button>
      ))}
    </div>
  );
}
