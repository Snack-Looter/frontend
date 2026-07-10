export function StepTracker({ current, total = 4 }: { current: number; total?: number }) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {steps.map((s) => {
        const done = s < current;
        const active = s === current;
        return (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div
              className={`flex items-center justify-center rounded-full font-display transition-colors duration-300 border-2.5 flex-shrink-0 ${
                done
                  ? "w-8 h-8 bg-secondary text-white border-ink"
                  : active
                    ? "w-10 h-10 bg-primary text-white text-body-strong border-ink shadow-solid-sm scale-105"
                    : "w-8 h-8 bg-surface-card text-neutral border-border-soft"
              }`}
            >
              {done ? (
                <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
                  check
                </span>
              ) : (
                s
              )}
            </div>
            {s !== steps[steps.length - 1] && (
              <div
                className={`flex-1 h-[3px] mx-1 rounded-full transition-colors duration-300 ${
                  done ? "bg-secondary" : "bg-border-soft"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
