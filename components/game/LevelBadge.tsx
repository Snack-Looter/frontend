export function LevelBadge({
  level,
  size = 64,
  label = "LEVEL",
  className = "",
}: {
  level: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-full bg-primary text-white border-3 border-ink shadow-solid-md flex flex-col items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="font-body text-[9px] font-semibold tracking-wide -mb-0.5">
        {label}
      </span>
      <span
        className="font-display font-extrabold leading-none"
        style={{ fontSize: size * 0.4 }}
      >
        {level}
      </span>
    </div>
  );
}
