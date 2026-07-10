"use client";

import Link from "next/link";
import { clearTokens, useIsAuthed } from "@/lib/auth";
import { PushButton } from "@/components/ui/PushButton";

export function AppHeader() {
  const { isAuthed, checked } = useIsAuthed();

  function handleLogout() {
    clearTokens();
    window.location.href = "/";
  }

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50 bg-surface border-b-2.5 border-ink flex items-center px-md h-16">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="relative w-9 h-9 rounded-full bg-primary text-white border-2.5 border-ink flex items-center justify-center shadow-press-primary transition-all duration-100 group-active:translate-y-1 group-active:shadow-none">
          <span
            className="material-symbols-rounded"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}
          >
            bolt
          </span>
        </span>
        <span className="font-display text-title text-primary tracking-tight">
          Kop<span className="text-ink">Quest</span>
        </span>
      </Link>

      {!checked ? null : isAuthed ? (
        <button
          onClick={handleLogout}
          aria-label="Keluar"
          title="Keluar"
          className="ml-auto w-10 h-10 rounded-full bg-surface-card text-ink-soft border-2 border-ink shadow-solid-sm flex items-center justify-center transition-all duration-100 hover:text-danger hover:border-danger active:translate-y-0.5 active:shadow-none"
        >
          <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
            logout
          </span>
        </button>
      ) : (
        <PushButton
          href="/chatbot"
          size="sm"
          className="ml-auto"
          icon={
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
              login
            </span>
          }
        >
          Login
        </PushButton>
      )}
    </header>
  );
}
