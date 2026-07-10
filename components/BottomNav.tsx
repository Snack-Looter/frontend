"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsAuthed } from "@/lib/auth";

const ITEMS = [
  { href: "/home", label: "Beranda", icon: "home" },
  { href: "#", label: "Progres", icon: "query_stats" },
  { href: "/chatbot", label: "AI Chat", icon: "smart_toy" },
  { href: "#", label: "Reward", icon: "military_tech" },
  { href: "#", label: "Akun", icon: "person" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthed, checked } = useIsAuthed();

  if (!checked || !isAuthed) return null;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50 px-md pb-3 pt-1 bg-gradient-to-t from-surface via-surface/95 to-transparent">
      <nav className="flex justify-around items-center px-2 py-2 bg-surface-card border-2.5 border-ink rounded-card shadow-solid-md">
        {ITEMS.map((item) => {
          const active = item.href !== "#" && pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-chip transition-all duration-150 active:scale-90 ${
                active ? "text-primary" : "text-neutral hover:text-primary"
              }`}
            >
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150 ${
                  active
                    ? "bg-primary text-white border-2 border-ink shadow-press-primary -translate-y-1"
                    : ""
                }`}
              >
                <span
                  className="material-symbols-rounded"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
              </span>
              <span className={`font-body text-caption ${active ? "font-bold" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
