"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type PushButtonVariant = "primary" | "secondary" | "tertiary" | "ghost";
export type PushButtonSize = "sm" | "md" | "lg";

const VARIANT_STYLES: Record<PushButtonVariant, string> = {
  primary: "bg-primary text-white shadow-press-primary",
  secondary: "bg-secondary text-white shadow-press-secondary",
  tertiary: "bg-tertiary text-white shadow-press-tertiary",
  ghost: "bg-surface-card text-ink shadow-solid-md",
};

const SIZE_STYLES: Record<PushButtonSize, string> = {
  sm: "px-4 py-2 text-caption",
  md: "px-6 py-3 text-label",
  lg: "px-8 py-4 text-label",
};

const BASE =
  "inline-flex items-center justify-center gap-2 font-body font-semibold rounded-button border-2.5 border-ink transition-all duration-100 active:translate-y-1 active:shadow-none";

const DISABLED_STYLES =
  "bg-surface-sunken text-neutral border-border-soft shadow-none cursor-not-allowed active:translate-y-0";

type BaseProps = {
  variant?: PushButtonVariant;
  size?: PushButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

type AsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { href?: undefined };
type AsLink = BaseProps & { href: string; disabled?: boolean };

export function PushButton(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", loading = false, icon, children, className = "" } = props;
  const disabled = "disabled" in props ? !!props.disabled : false;
  const isDisabled = disabled || loading;
  const classes = `${BASE} ${SIZE_STYLES[size]} ${
    isDisabled ? DISABLED_STYLES : VARIANT_STYLES[variant]
  } ${className}`;

  if (props.href) {
    return (
      <Link href={props.href} className={classes}>
        {loading ? <Spinner /> : icon}
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    loading: _l,
    icon: _i,
    children: _c,
    className: _cl,
    href: _h,
    ...buttonProps
  } = props as AsButton;

  return (
    <button {...buttonProps} disabled={isDisabled} className={classes}>
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />;
}
