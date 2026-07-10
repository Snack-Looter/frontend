import type { ReactNode } from "react";

export type BattlePassNodeState = "locked" | "unlocked" | "claimed";

const STATE_STYLES: Record<BattlePassNodeState, string> = {
  locked: "bg-surface-sunken text-neutral border-border-soft",
  unlocked: "bg-primary text-white border-ink shadow-solid-sm",
  claimed: "bg-secondary text-white border-ink shadow-solid-sm",
};

export function BattlePassNode({
  tier,
  state,
  icon,
  className = "",
}: {
  tier: number;
  state: BattlePassNodeState;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className={`w-12 h-12 rounded-full border-2.5 flex items-center justify-center font-display font-bold ${STATE_STYLES[state]}`}
      >
        {state === "claimed" ? (
          <span className="material-symbols-rounded" style={{ fontSize: 22 }}>
            check
          </span>
        ) : state === "locked" ? (
          <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
            lock
          </span>
        ) : (
          (icon ?? tier)
        )}
      </div>
      <span className="font-body text-caption text-ink-soft font-medium">Tier {tier}</span>
    </div>
  );
}
