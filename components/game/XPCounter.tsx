"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, durationMs = 800, start = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    setValue(0);
    let raf: number;
    const startTime = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - startTime) / durationMs, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, durationMs]);

  return value;
}

export function XPCounter({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-display font-bold text-stat text-secondary-dark ${className}`}
    >
      <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
        bolt
      </span>
      +{value} XP
    </span>
  );
}
