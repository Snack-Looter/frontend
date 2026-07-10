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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = inputProps.type === "password";
  const showCheck = touched && valid && !error;
  const inputType = isPasswordField && isPasswordVisible ? "text" : inputProps.type;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-label text-ink">{label}</span>
      <div className="relative">
        <input
          {...inputProps}
          type={inputType}
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
          } ${isPasswordField || showCheck ? "pr-14" : ""} ${className}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {showCheck && (
            <span className="text-secondary-dark animate-pop">
              <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
                check_circle
              </span>
            </span>
          )}
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={isPasswordVisible ? "Sembunyikan password" : "Tampilkan password"}
              aria-pressed={isPasswordVisible}
            >
              <span className="material-symbols-rounded" style={{ fontSize: 22 }}>
                {isPasswordVisible ? "visibility_off" : "visibility"}
              </span>
            </button>
          )}
        </div>
      </div>
      {error && <span className="font-body text-caption text-danger">{error}</span>}
    </label>
  );
}
