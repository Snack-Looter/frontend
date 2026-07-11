"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { PageLoader } from "@/components/ui/PageLoader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PushButton } from "@/components/ui/PushButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { BattlePassNode, type BattlePassNodeState } from "@/components/game/BattlePassNode";
import { useIsAuthed } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import {
  ApiError,
  getBattlePassStatus,
  type BattlePassMilestone,
  type BattlePassStatus,
} from "@/lib/api";

export default function RewardPage() {
  const { isAuthed, checked } = useIsAuthed();
  const { showToast } = useToast();

  const [battlePass, setBattlePass] = useState<BattlePassStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!checked || !isAuthed) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getBattlePassStatus();
        if (!cancelled) setBattlePass(data);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Gagal memuat reward kamu.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [checked, isAuthed]);

  // Backend belum punya endpoint klaim reward (kolom redeemed_at ada tapi
  // tak pernah ditulis di mana pun) — tombol tetap tampil supaya pemain tahu
  // rewardnya sudah kebuka, tapi aksinya jujur bilang belum tersedia,
  // sama seperti pola "Segera hadir!" buat role yang masih terkunci di Beranda.
  function handleClaim() {
    showToast("Fitur klaim reward segera hadir!", "info");
  }

  if (!checked || (isAuthed && loading)) {
    return (
      <Shell>
        <PageLoader label="Memuat reward kamu..." />
      </Shell>
    );
  }

  if (!isAuthed) {
    return (
      <Shell>
        <div className="px-md">
          <Card className="text-center flex flex-col gap-3 mt-8">
            <h2 className="font-display text-title text-ink">Masuk dulu yuk</h2>
            <p className="font-body text-body text-ink-soft">
              Semua reward battle pass kamu nunggu di sana — masuk dulu buat lihat.
            </p>
            <PushButton href="/chatbot" className="w-full mt-1">
              Masuk
            </PushButton>
          </Card>
        </div>
      </Shell>
    );
  }

  const totalXp = battlePass?.total_xp ?? 0;
  const roadmap = battlePass?.roadmap ?? [];
  const currentTier = battlePass?.current_tier ?? 0;

  // Sama seperti backend: "berikutnya" ditentukan dari perbandingan XP
  // langsung terhadap threshold, bukan dari flag `unlocked` per baris —
  // supaya progress bar ini selalu konsisten dengan next_reward/xp_required_to_next.
  const nextMilestone = roadmap.find((m) => m.total_xp_threshold > totalXp);
  const prevThreshold =
    [...roadmap].reverse().find((m) => m.total_xp_threshold <= totalXp)?.total_xp_threshold ?? 0;
  const tierSpan = nextMilestone ? nextMilestone.total_xp_threshold - prevThreshold : 0;
  const tierProgressPercent =
    nextMilestone && tierSpan > 0 ? ((totalXp - prevThreshold) / tierSpan) * 100 : 100;

  return (
    <Shell>
      {loadError && (
        <p className="font-body text-label text-danger text-center px-md mt-4">{loadError}</p>
      )}

      <section className="px-md pt-6 pb-4">
        <h1 className="font-display text-display text-ink">Reward Center</h1>
        <p className="font-body text-body text-ink-soft mt-1">
          Kumpulin XP, buka reward battle pass kamu satu per satu.
        </p>
      </section>

      {/* Ringkasan total XP + progress ke reward berikutnya */}
      <section className="px-md pb-6">
        <Card variant="hero" className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="w-14 h-14 rounded-full bg-primary text-white border-2.5 border-ink flex items-center justify-center flex-shrink-0 shadow-press-primary">
              <span
                className="material-symbols-rounded"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: 30 }}
              >
                star
              </span>
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-body text-caption font-semibold text-ink-soft">Total XP</p>
              <p className="font-display font-extrabold text-ink leading-none text-[32px]">
                {totalXp.toLocaleString("id-ID")}
              </p>
            </div>
            <Chip variant="level">Tier {currentTier}</Chip>
          </div>

          {nextMilestone ? (
            <div>
              <ProgressBar percent={tierProgressPercent} className="h-3" />
              <p className="font-body text-caption text-ink-soft mt-1.5 text-center">
                {(battlePass?.xp_required_to_next ?? 0).toLocaleString("id-ID")} XP lagi buat
                &quot;{nextMilestone.reward_description}&quot;
              </p>
            </div>
          ) : roadmap.length > 0 ? (
            <p className="font-body text-body-strong text-secondary-dark text-center">
              Semua reward udah kebuka! 🎉
            </p>
          ) : null}
        </Card>
      </section>

      {/* Roadmap semua milestone */}
      <section className="px-md pb-8">
        <h3 className="font-display text-title text-ink mb-4">Roadmap Reward</h3>
        {roadmap.length === 0 ? (
          <EmptyState
            icon={
              <span className="material-symbols-rounded" style={{ fontSize: 28 }}>
                military_tech
              </span>
            }
            title="Belum ada reward"
            description="Roadmap reward battle pass bakal muncul di sini begitu tersedia."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {roadmap.map((milestone, index) => (
              <MilestoneRow
                key={milestone.milestone_id}
                milestone={milestone}
                tier={index + 1}
                totalXp={totalXp}
                onClaim={handleClaim}
              />
            ))}
          </div>
        )}
      </section>
    </Shell>
  );
}

// --- Shell: header + main + bottom nav ------------------------------------
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface text-ink font-body text-body min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow pt-16 pb-24 max-w-app mx-auto w-full">{children}</main>
      <BottomNav />
    </div>
  );
}

// --- Satu baris milestone di roadmap ---------------------------------------
function MilestoneRow({
  milestone,
  tier,
  totalXp,
  onClaim,
}: {
  milestone: BattlePassMilestone;
  tier: number;
  totalXp: number;
  onClaim: () => void;
}) {
  const state: BattlePassNodeState = milestone.redeemed_at
    ? "claimed"
    : milestone.unlocked
      ? "unlocked"
      : "locked";
  const xpShort = Math.max(0, milestone.total_xp_threshold - totalXp);

  return (
    <Card className="flex items-center gap-4">
      <BattlePassNode tier={tier} state={state} className="flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-body text-body-strong text-ink">{milestone.reward_description}</p>
        {state === "locked" ? (
          <p className="font-body text-caption text-ink-soft mt-0.5">
            Butuh {milestone.total_xp_threshold.toLocaleString("id-ID")} XP
            {xpShort > 0 && ` · ${xpShort.toLocaleString("id-ID")} XP lagi`}
          </p>
        ) : state === "claimed" ? (
          <p className="font-body text-caption text-ink-soft mt-0.5">
            Diklaim {formatDate(milestone.redeemed_at)}
          </p>
        ) : (
          <p className="font-body text-caption text-ink-soft mt-0.5">
            Terbuka {formatDate(milestone.unlocked_at)}
          </p>
        )}
      </div>
      {state === "unlocked" && (
        <PushButton size="sm" variant="secondary" onClick={onClaim} className="flex-shrink-0">
          Klaim
        </PushButton>
      )}
    </Card>
  );
}
