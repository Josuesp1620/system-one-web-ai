/** Líneas animadas que salen del mensaje hacia las decisiones: una sola pasada alimenta todas. */
export function FlowLines({ count }: { count: number }) {
  const rows = Array.from({ length: count }, (value, index) => ((index + 0.5) / count) * 100);
  return (
    <svg className="hidden h-full w-16 shrink-0 md:block" viewBox="0 0 64 100" preserveAspectRatio="none" aria-hidden>
      {rows.map((row) => (
        <path key={row} d={`M0 50 C 32 50, 32 ${row}, 64 ${row}`} fill="none" stroke="#5ee0f0" strokeOpacity="0.55" strokeWidth="0.8"
          strokeDasharray="3 3" vectorEffect="non-scaling-stroke" className="flow-line" />
      ))}
    </svg>
  );
}
