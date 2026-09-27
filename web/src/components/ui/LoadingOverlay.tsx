/** Aviso de carga grande y centrado, sobre la pantalla atenuada, para que se note que está trabajando. */
export function LoadingOverlay({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-canvas/70 backdrop-blur-[2px]" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <span className="h-14 w-14 animate-spin rounded-full border-4 border-white/15 border-t-accent" aria-hidden />
        <p className="text-lg font-semibold">{text}</p>
      </div>
    </div>
  );
}
