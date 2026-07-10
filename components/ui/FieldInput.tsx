"use client";

import { useState, type InputHTMLAttributes } from "react";

export function FieldInput({
  label,
  error,
  valid,
  className = "",
  onBlur,
  ...inputProps
}: {
  label: string;
  error?: string;
  valid?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  const [touched, setTouched] = useState(false);
  const showCheck = touched && valid && !error;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-label text-ink">{label}</span>
      <div className="relative">
        <input
          {...inputProps}
          onBlur={(e) => {
            setTouched(true);
            onBlur?.(e);
          }}
          className={`w-full rounded-button border-2.5 px-4 py-3 font-body text-body text-ink bg-surface-card focus:outline-none transition-colors ${
            error
              ? "border-danger"
              : valid && touched
                ? "border-secondary"
                : "border-border-soft focus:border-primary"
          } ${className}`}
        />
        {showCheck && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-dark animate-pop">
            <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
              check_circle
            </span>
          </span>
        )}
      </div>
      {error && <span className="font-body text-caption text-danger">{error}</span>}
    </label>
  );
}
