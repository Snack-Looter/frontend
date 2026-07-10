import type { ReactNode } from "react";

export function StatTile({
  label,
  value,
  icon,
  className = "",
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-surface-card border-2.5 border-ink rounded-card shadow-solid-sm p-3.5 ${className}`}
    >
      <div className="flex items-center gap-1 font-body text-caption text-ink-soft font-medium">
        {icon}
        {label}
      </div>
      <div className="font-display font-extrabold text-title mt-0.5 text-ink">{value}</div>
    </div>
  );
}
