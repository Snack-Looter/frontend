import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 bg-surface-card border-2.5 border-ink rounded-card shadow-solid-sm p-5">
      <span className="w-14 h-14 rounded-full bg-tertiary-light border-2.5 border-ink flex items-center justify-center flex-shrink-0 text-tertiary-dark">
        {icon}
      </span>
      <div className="flex-1">
        <h4 className="font-display text-title-sm text-ink">{title}</h4>
        <p className="font-body text-caption text-ink-soft mt-0.5">{description}</p>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
