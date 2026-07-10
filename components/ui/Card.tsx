import type { ReactNode } from "react";

type CardVariant = "flat" | "elevated" | "hero";

const VARIANT_STYLES: Record<CardVariant, string> = {
  flat: "shadow-none border-2.5",
  elevated: "shadow-solid-md border-2.5",
  hero: "shadow-solid-lg border-3",
};

export function Card({
  children,
  variant = "elevated",
  className = "",
  animate = false,
}: {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  animate?: boolean;
}) {
  return (
    <div
      className={`relative bg-surface-card rounded-card border-ink p-5 ${VARIANT_STYLES[variant]} ${
        animate ? "animate-card-in" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
