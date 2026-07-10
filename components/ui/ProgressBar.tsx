export function ProgressBar({
  percent,
  className = "",
}: {
  percent: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={`h-4 w-full bg-surface-sunken border-2 border-ink rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-secondary rounded-full relative overflow-hidden transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      >
        <div className="progress-stripe" />
      </div>
    </div>
  );
}
