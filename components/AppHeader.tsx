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
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50 bg-surface border-b-2 border-border-soft flex items-center px-md h-16">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="w-9 h-9 rounded-full bg-primary text-white border-2.5 border-ink flex items-center justify-center shadow-press-primary transition-all duration-100 group-active:translate-y-1 group-active:shadow-none">
          <span
            className="material-symbols-rounded"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}
          >
            bolt
          </span>
        </span>
        <span className="font-display text-title text-primary">KopQuest</span>
      </Link>

      {!checked ? null : isAuthed ? (
        <button
          onClick={handleLogout}
          className="ml-auto font-body text-label font-semibold text-neutral hover:text-danger transition-colors"
        >
          Logout
        </button>
      ) : (
        <PushButton href="/chatbot" size="sm" className="ml-auto">
          Login
        </PushButton>
      )}
    </header>
  );
}
