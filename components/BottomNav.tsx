"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsAuthed } from "@/lib/auth";

const ITEMS = [
  { href: "/home", label: "Beranda", icon: "home" },
  { href: "/progress", label: "Progres", icon: "query_stats" },
  { href: "/chatbot", label: "AI Chat", icon: "smart_toy" },
  { href: "#", label: "Reward", icon: "military_tech" },
  { href: "/account", label: "Akun", icon: "person" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthed, checked } = useIsAuthed();

  if (!checked || !isAuthed) return null;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50 px-md pb-3 pt-2 bg-gradient-to-t from-surface via-surface/95 to-transparent">
      <nav className="flex items-center justify-around gap-1 p-1.5 bg-surface-card border-2.5 border-ink rounded-card shadow-solid-md">
        {ITEMS.map((item) => {
          const active = item.href !== "#" && pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-1.5 rounded-full border-2.5 transition-all duration-200 active:scale-95 ${
                active
                  ? "bg-primary text-white border-ink shadow-press-primary px-3.5 py-2"
                  : "border-transparent text-neutral hover:text-primary hover:bg-surface-sunken px-2.5 py-2"
              }`}
            >
              <span
                className="material-symbols-rounded"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {active && (
                <span className="font-body text-caption font-bold whitespace-nowrap pr-0.5">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
