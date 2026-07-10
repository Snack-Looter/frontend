import type { ReactNode } from "react";

export type ChipVariant =
  | "level"
  | "success"
  | "danger"
  | "warning"
  | "earth"
  | "neutral"
  | "primary-soft";

const VARIANT_STYLES: Record<ChipVariant, string> = {
  level: "bg-primary text-white font-display font-bold",
  success: "bg-secondary-light text-secondary-dark",
  danger: "bg-danger/10 text-danger-dark",
  warning: "bg-warning text-ink",
  earth: "bg-tertiary-light text-tertiary-dark",
  neutral: "bg-surface-sunken text-ink-soft",
  "primary-soft": "bg-primary-light text-primary-dark",
};

export function Chip({
  children,
  variant = "neutral",
  icon,
  className = "",
}: {
  children: ReactNode;
  variant?: ChipVariant;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-body text-caption font-semibold px-3 py-1 rounded-chip border-2 border-ink whitespace-nowrap ${VARIANT_STYLES[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

type StickerVariant = "warning" | "primary" | "secondary";

const STICKER_STYLES: Record<StickerVariant, string> = {
  warning: "bg-warning text-ink",
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
};

export function StickerTag({
  children,
  variant = "warning",
  className = "",
  onClick,
}: {
  children: ReactNode;
  variant?: StickerVariant;
  className?: string;
  onClick?: () => void;
}) {
  const classes = `absolute -top-3 -right-2 rotate-[-6deg] font-display font-bold text-caption px-3 py-1 rounded-chip border-2.5 border-ink shadow-solid-sm ${STICKER_STYLES[variant]} ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }

  return <span className={classes}>{children}</span>;
}
