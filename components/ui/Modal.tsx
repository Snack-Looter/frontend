"use client";

import { useEffect, type ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-md">
      <div className="absolute inset-0 bg-ink/50 animate-overlay-in" onClick={onClose} />
      <div className="relative w-full max-w-[24rem] bg-surface-card border-3 border-ink rounded-card shadow-solid-lg p-6 animate-card-in">
        {title && <h3 className="font-display text-title text-ink mb-3">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center">
      <div className="absolute inset-0 bg-ink/50 animate-overlay-in" onClick={onClose} />
      <div className="relative w-full max-w-app bg-surface-card border-3 border-b-0 border-ink rounded-t-card shadow-solid-lg p-6 pb-8 animate-sheet-up">
        <div className="w-10 h-1.5 bg-border-soft rounded-full mx-auto mb-4" />
        {title && <h3 className="font-display text-title text-ink mb-3">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
