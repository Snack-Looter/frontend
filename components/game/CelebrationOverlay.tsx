"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useCountUp } from "./XPCounter";

const CONFETTI_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#DC2626", "#A54100"];

type Confetto = {
  id: number;
  dx: number;
  dy: number;
  color: string;
  delay: number;
  round: boolean;
};

export function CelebrationOverlay({
  title,
  subtitle,
  xp,
  bonusXp,
  bonusLabel,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  xp: number;
  bonusXp?: number;
  bonusLabel?: string;
  icon: ReactNode;
  children?: ReactNode;
}) {
  const [confetti, setConfetti] = useState<Confetto[]>([]);
  const [bonusPhase, setBonusPhase] = useState(false);

  const baseXp = useCountUp(xp, 900, true);
  const bonus = useCountUp(bonusXp ?? 0, 700, bonusPhase);

  useEffect(() => {
    setConfetti(
      Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const dist = 60 + Math.random() * 30;
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          delay: 150 + Math.random() * 150,
          round: i % 2 === 0,
        };
      }),
    );
  }, []);

  useEffect(() => {
    if (!bonusXp) return;
    const t = setTimeout(() => setBonusPhase(true), 1000);
    return () => clearTimeout(t);
  }, [bonusXp]);

  const total = xp + (bonusXp ?? 0);
  const progressPct = total > 0 ? ((baseXp + bonus) / total) * 100 : 0;

  return (
    <div className="relative bg-surface-card border-3 border-ink rounded-card shadow-solid-lg p-8 flex flex-col items-center text-center gap-3 overflow-hidden animate-card-in">
      <div className="relative w-20 h-20">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="absolute w-2 h-2 border border-ink"
            style={
              {
                background: c.color,
                borderRadius: c.round ? "50%" : "2px",
                left: "50%",
                top: "40%",
                "--dx": `${c.dx}px`,
                "--dy": `${c.dy}px`,
                animation: `confetti-burst 900ms ease-out ${c.delay}ms forwards`,
              } as CSSProperties
            }
          />
        ))}
        <span className="absolute inset-0 w-20 h-20 rounded-full bg-secondary text-white border-3 border-ink shadow-solid-md flex items-center justify-center animate-bounce-in z-10">
          {icon}
        </span>
      </div>
      <h2 className="font-display text-title text-ink">{title}</h2>
      <p className="font-body text-body text-ink-soft">{subtitle}</p>
      <p className="font-display text-stat-hero text-secondary-dark leading-none">+{baseXp} XP</p>
      {!!bonusXp && bonusPhase && (
        <p className="font-display text-stat text-tertiary">
          +{bonus} XP {bonusLabel ?? "bonus"}
        </p>
      )}
      <ProgressBar percent={progressPct} className="mt-2" />
      {children}
    </div>
  );
}
