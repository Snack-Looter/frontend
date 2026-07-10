import type { ReactNode } from "react";
import { StickerTag } from "@/components/ui/Chip";

export type RoleColor = "primary" | "secondary" | "tertiary";

const COLOR_STYLES: Record<RoleColor, { border: string; shadow: string; iconBg: string }> = {
  primary: { border: "border-primary", shadow: "shadow-press-primary", iconBg: "bg-primary" },
  secondary: {
    border: "border-secondary",
    shadow: "shadow-press-secondary",
    iconBg: "bg-secondary",
  },
  tertiary: { border: "border-tertiary", shadow: "shadow-press-tertiary", iconBg: "bg-tertiary" },
};

export function RoleCard({
  icon,
  name,
  description,
  color,
  badge,
  locked,
  onClick,
}: {
  icon: ReactNode;
  name: string;
  description: string;
  color: RoleColor;
  badge?: string;
  locked?: boolean;
  onClick?: () => void;
}) {
  const c = COLOR_STYLES[color];

  if (locked) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="relative w-full text-left bg-surface-card rounded-card border-2.5 border-dashed border-border-soft p-5 flex flex-col items-center text-center gap-2 opacity-60"
      >
        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-surface-sunken border-2 border-ink flex items-center justify-center">
          <span className="material-symbols-rounded" style={{ fontSize: 16 }}>
            lock
          </span>
        </span>
        <span className="w-14 h-14 rounded-full text-neutral border-2.5 border-border-soft bg-surface-sunken flex items-center justify-center mt-1">
          {icon}
        </span>
        <h4 className="font-display text-title-sm text-ink-soft">{name}</h4>
        <p className="font-body text-caption text-neutral">{description}</p>
      </button>
    );
  }

  return (
    <div
      className={`relative bg-surface-card rounded-card border-2.5 p-5 flex flex-col items-center text-center gap-2 ${c.border} ${c.shadow}`}
    >
      {badge && (
        <StickerTag variant={color === "tertiary" ? "warning" : color}>{badge}</StickerTag>
      )}
      <span
        className={`w-14 h-14 rounded-full text-white border-2.5 border-ink flex items-center justify-center mt-1 ${c.iconBg}`}
      >
        {icon}
      </span>
      <h4 className="font-display text-title-sm text-ink">{name}</h4>
      <p className="font-body text-caption text-ink-soft">{description}</p>
    </div>
  );
}
