export function PageLoader({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-[60vh] px-md text-center">
      <div className="relative w-24 h-24 flex items-center justify-center animate-bounce-in">
        <span className="absolute inset-0 rounded-full border-4 border-dashed border-primary animate-spin-slow" />
        <span className="w-16 h-16 rounded-full bg-primary text-white border-3 border-ink shadow-solid-md flex items-center justify-center animate-pulse-scale">
          <span
            className="material-symbols-rounded"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: 28 }}
          >
            bolt
          </span>
        </span>
      </div>
      <p className="font-body text-body text-ink-soft">{label}</p>
    </div>
  );
}
