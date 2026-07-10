"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/Card";
import { PushButton } from "@/components/ui/PushButton";
import { Chip, StickerTag } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatTile } from "@/components/game/StatTile";
import { LevelBadge } from "@/components/game/LevelBadge";
import { RoleCard } from "@/components/game/RoleCard";
import { BottomSheet } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useIsAuthed } from "@/lib/auth";
import { daysRemaining, formatRupiah } from "@/lib/format";
import {
  ApiError,
  generateMission,
  getActiveMission,
  getBattlePassStatus,
  getMissionHistory,
  getProfile,
  getRoleSummary,
  getRoles,
  type BattlePassStatus,
  type Mission,
  type Profile,
  type RoleInfo,
  type RoleSummary,
} from "@/lib/api";

const KNOWN_ROLES = [
  {
    name: "Affiliator",
    icon: "storefront",
    color: "primary" as const,
    description: "Jual produk koperasi dan dapat komisi dari setiap penjualan",
  },
  {
    name: "Content Creator",
    icon: "photo_camera",
    color: "secondary" as const,
    description: "Bikin konten promosi yang menarik untuk produk koperasi",
  },
  {
    name: "Duta Sebaya",
    icon: "diversity_3",
    color: "tertiary" as const,
    description: "Ajak warga bergabung dan kenalkan koperasi ke lingkungan sekitar",
  },
];

const MISSIONS_PER_LEVEL = 5;

export default function HomePage() {
  const { isAuthed, checked } = useIsAuthed();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [affiliatorSummary, setAffiliatorSummary] = useState<RoleSummary | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [lastMission, setLastMission] = useState<Mission | null>(null);
  const [historyChecked, setHistoryChecked] = useState(false);
  const [battlePass, setBattlePass] = useState<BattlePassStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!checked || !isAuthed) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const [profileData, rolesData, battlePassData] = await Promise.all([
          getProfile(),
          getRoles(),
          getBattlePassStatus(),
        ]);
        if (cancelled) return;
        setProfile(profileData);
        setRoles(rolesData);
        setBattlePass(battlePassData);

        const affiliator = rolesData.find((r) => r.role_name === "Affiliator");
        if (affiliator) {
          const [summary, activeMissionRes, history] = await Promise.all([
            getRoleSummary(affiliator.role_id),
            getActiveMission(affiliator.role_id),
            getMissionHistory(),
          ]);
          if (cancelled) return;
          setAffiliatorSummary(summary);
          setActiveMission(activeMissionRes.active_mission);
          setLastMission(history[0] ?? null);
          setHistoryChecked(true);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Gagal memuat berandamu.");
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

  const affiliatorRoleId = roles.find((r) => r.role_name === "Affiliator")?.role_id;

  async function handleFindMission() {
    if (!affiliatorRoleId) return;
    setGenerating(true);
    try {
      const mission = await generateMission(affiliatorRoleId);
      setActiveMission(mission);
      showToast("Misi baru dibuat! Cek nanti di detail misi.", "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Gagal membuat misi.", "danger");
    } finally {
      setGenerating(false);
    }
  }

  function handleLockedRoleTap() {
    showToast("Segera hadir!", "info");
  }

  if (!checked || (isAuthed && loading)) {
    return (
      <div className="bg-surface text-ink font-body text-body min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-grow pt-16 pb-24 max-w-app mx-auto w-full px-md flex items-center justify-center">
          <p className="font-body text-body text-ink-soft">Memuat berandamu...</p>
        </main>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="bg-surface text-ink font-body text-body min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-grow pt-16 pb-24 max-w-app mx-auto w-full px-md flex items-center justify-center">
          <Card className="text-center flex flex-col gap-3">
            <h2 className="font-display text-title text-ink">Masuk dulu yuk</h2>
            <p className="font-body text-body text-ink-soft">
              Berandamu nunggu di sana — masuk dulu buat lihat progres dan misimu.
            </p>
            <PushButton href="/chatbot" className="w-full mt-1">
              Masuk
            </PushButton>
          </Card>
        </main>
      </div>
    );
  }

  const missionsDone = affiliatorSummary
    ? affiliatorSummary.mission_completed_count % MISSIONS_PER_LEVEL
    : 0;
  const level = affiliatorSummary?.current_level_number ?? 1;
  const rewardsRedeemed = battlePass?.roadmap.filter((m) => m.redeemed_at).length ?? 0;
  const roleActiveCount = profile?.roles.length ?? 0;
  const missionDeadlineDays = activeMission ? daysRemaining(activeMission.deadline_date) : null;
  const missionUrgent = missionDeadlineDays !== null && missionDeadlineDays <= 2;
  const missionProgressPercent = activeMission
    ? (activeMission.current_quantity / Math.max(activeMission.target_quantity, 1)) * 100
    : 0;

  return (
    <div className="bg-surface text-ink font-body text-body min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-grow pt-16 pb-24 max-w-app mx-auto w-full px-md">
        {loadError && (
          <p className="font-body text-label text-danger text-center mt-6">{loadError}</p>
        )}

        {/* 1. Header sapaan */}
        <section className="pt-8 pb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-ink">
              Halo, {profile?.name.split(" ")[0] ?? "Sobat"}! 👋
            </h1>
            <p className="font-body text-body text-ink-soft mt-1">
              {activeMission
                ? "Misi kamu udah jalan, gaskeun!"
                : historyChecked && lastMission
                  ? "Siap lanjut ke misi berikutnya?"
                  : "Yuk mulai misi pertamamu di koperasi."}
            </p>
          </div>
          <span className="w-16 h-16 rounded-full bg-tertiary text-white border-2.5 border-ink shadow-solid-md flex items-center justify-center flex-shrink-0 animate-bounce-in">
            <span className="material-symbols-rounded" style={{ fontSize: 32 }}>
              front_hand
            </span>
          </span>
        </section>

        {/* 2. Level & account summary */}
        <section className="pb-8">
          <div className="flex gap-3 items-stretch">
            <LevelBadge level={level} size={76} />
            <StatTile
              label="Total XP"
              value={profile?.total_xp ?? 0}
              icon={
                <span className="material-symbols-rounded" style={{ fontSize: 15 }}>
                  bolt
                </span>
              }
              className="flex-1"
            />
          </div>
          <ProgressBar percent={(missionsDone / MISSIONS_PER_LEVEL) * 100} className="mt-3 h-3" />
          <p className="font-body text-caption text-ink-soft mt-1.5 text-center">
            {missionsDone}/{MISSIONS_PER_LEVEL} misi ke level berikutnya
          </p>
        </section>

        {/* 3. Role selector */}
        <section className="pb-8">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="w-full flex items-center justify-between bg-primary text-white border-2.5 border-ink rounded-button shadow-press-primary px-5 py-3 active:translate-y-1 active:shadow-none transition-all duration-100"
          >
            <span className="font-body text-label font-bold flex items-center gap-2">
              <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
                storefront
              </span>
              Affiliator
            </span>
            <span className="material-symbols-rounded">expand_more</span>
          </button>
          <p className="font-body text-caption text-neutral text-center mt-2">
            Role lain nyusul — fokus dulu di Affiliator!
          </p>
        </section>

        {activeMission ? (
          /* 4. Mission card — flagship */
          <section className="pb-8">
            <Card variant="hero" className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <Chip variant="success">Sedang Berjalan</Chip>
                <Chip
                  variant={missionUrgent ? "warning" : "neutral"}
                  className={missionUrgent ? "animate-pulse" : ""}
                >
                  {missionDeadlineDays} Hari Tersisa
                </Chip>
              </div>
              <h2 className="font-display text-title text-ink">
                Jual {activeMission.target_quantity} {activeMission.product_name_snapshot}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                <Chip variant="earth">Target Rp{formatRupiah(activeMission.target_gmv)}</Chip>
                <Chip variant="primary-soft">{activeMission.target_quantity} pcs</Chip>
                <Chip variant="success">+{activeMission.xp_reward} XP</Chip>
              </div>
              <ProgressBar percent={missionProgressPercent} />
              <p className="font-body text-caption text-ink-soft">
                {activeMission.current_quantity}/{activeMission.target_quantity} terjual
              </p>
              <PushButton href={`/mission/${activeMission.mission_id}`} className="w-full mt-1">
                Lanjut Misi
              </PushButton>
            </Card>
          </section>
        ) : (
          /* 4. Empty state mission — beda copy first-time vs returning */
          <section className="pb-8">
            <Card variant="hero" className="text-center flex flex-col items-center gap-3">
              {historyChecked && lastMission ? (
                <>
                  <StickerTag>LANJUT LAGI!</StickerTag>
                  <span className="w-20 h-20 rounded-full bg-primary text-white border-3 border-ink shadow-solid-md flex items-center justify-center animate-bounce-in">
                    <span className="material-symbols-rounded" style={{ fontSize: 40 }}>
                      {lastMission.status === "completed" ? "celebration" : "favorite"}
                    </span>
                  </span>
                  <h2 className="font-display text-title text-ink">
                    {lastMission.status === "completed" ? "Mantap, lanjut lagi!" : "Jangan nyerah!"}
                  </h2>
                  <p className="font-body text-body text-ink-soft">
                    {lastMission.status === "completed"
                      ? `Mantap! Misi terakhir kamu berhasil, +${lastMission.xp_reward} XP masuk 🎉 Lanjut lagi yuk!`
                      : "Belum berhasil kali ini, tapi jangan nyerah! Coba misi berikutnya yuk 💪"}
                  </p>
                  <PushButton
                    onClick={handleFindMission}
                    loading={generating}
                    disabled={!affiliatorRoleId}
                    icon={
                      <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
                        search
                      </span>
                    }
                    className="w-full mt-1"
                  >
                    Cari Misi Lagi
                  </PushButton>
                </>
              ) : (
                <>
                  <StickerTag>MULAI DI SINI!</StickerTag>
                  <span className="w-20 h-20 rounded-full bg-primary text-white border-3 border-ink shadow-solid-md flex items-center justify-center animate-bounce-in">
                    <span className="material-symbols-rounded" style={{ fontSize: 40 }}>
                      rocket_launch
                    </span>
                  </span>
                  <h2 className="font-display text-title text-ink">Misi pertamamu nunggu nih!</h2>
                  <p className="font-body text-body text-ink-soft">
                    Sebagai Affiliator, kamu bakal jualan produk koperasi dan dapet XP tiap kali
                    berhasil.
                  </p>
                  <PushButton
                    onClick={handleFindMission}
                    loading={generating}
                    disabled={!affiliatorRoleId}
                    icon={
                      <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
                        search
                      </span>
                    }
                    className="w-full mt-1"
                  >
                    Cari Misi
                  </PushButton>
                </>
              )}
            </Card>
          </section>
        )}

        {/* 5. Ringkasan akun — selalu tampil, terlepas dari state mission */}
        <section className="pb-8">
          <h3 className="font-display text-title text-ink mb-4">Ringkasan Akun</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              label="Misi Selesai"
              value={affiliatorSummary?.mission_completed_count ?? 0}
              icon={
                <span className="material-symbols-rounded" style={{ fontSize: 15 }}>
                  task_alt
                </span>
              }
            />
            <StatTile
              label="Misi Gagal"
              value={affiliatorSummary?.mission_failed_count ?? 0}
              icon={
                <span className="material-symbols-rounded" style={{ fontSize: 15 }}>
                  cancel
                </span>
              }
            />
            <StatTile
              label="Reward Diklaim"
              value={rewardsRedeemed}
              icon={
                <span className="material-symbols-rounded" style={{ fontSize: 15 }}>
                  redeem
                </span>
              }
            />
            <StatTile
              label="Role Aktif"
              value={roleActiveCount}
              icon={
                <span className="material-symbols-rounded" style={{ fontSize: 15 }}>
                  diversity_3
                </span>
              }
            />
          </div>
        </section>

        {/* 6. AI Assistant banner — selalu tampil, terlepas dari state mission */}
        <section className="pb-8">
          <div className="bg-primary text-white border-2.5 border-ink rounded-card shadow-solid-md p-5 flex items-center gap-4">
            <span className="w-14 h-14 rounded-full bg-white text-primary border-2.5 border-ink flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-rounded" style={{ fontSize: 28 }}>
                psychology
              </span>
            </span>
            <div className="flex-1">
              <p className="font-display text-title-sm">Bingung strategi jualan? Tanya aku!</p>
              <PushButton
                href="/chatbot"
                className="!bg-white !text-primary !shadow-solid-sm active:!shadow-none mt-2 !px-4 !py-2"
              >
                Tanya AI Assistant
              </PushButton>
            </div>
          </div>
        </section>

        {!activeMission && (
          /* 7. Preview role lain — cuma relevan saat lagi idle (belum ada mission jalan) */
          <section className="pb-8">
            <h3 className="font-display text-title text-ink mb-4">
              Role yang bisa kamu buka nanti
            </h3>
            <div className="grid gap-4">
              {KNOWN_ROLES.filter((r) => r.name !== "Affiliator").map((role) => (
                <RoleCard
                  key={role.name}
                  locked
                  onClick={handleLockedRoleTap}
                  color={role.color}
                  name={role.name}
                  description={role.description}
                  icon={<span className="material-symbols-rounded">{role.icon}</span>}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Pilih Role">
        <div className="flex flex-col gap-3">
          {KNOWN_ROLES.map((role) => {
            const isAffiliator = role.name === "Affiliator";
            if (isAffiliator) {
              return (
                <button
                  key={role.name}
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="w-full flex items-center gap-3 bg-primary-light border-2.5 border-primary rounded-button px-4 py-3 text-left"
                >
                  <span className="w-10 h-10 rounded-full bg-primary text-white border-2 border-ink flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
                      {role.icon}
                    </span>
                  </span>
                  <span className="flex-1">
                    <span className="font-body text-body-strong text-ink block">{role.name}</span>
                    <span className="font-body text-caption text-ink-soft">
                      Level {level} · aktif
                    </span>
                  </span>
                  <span className="material-symbols-rounded text-primary">check_circle</span>
                </button>
              );
            }
            return (
              <button
                key={role.name}
                type="button"
                onClick={() => {
                  setSheetOpen(false);
                  handleLockedRoleTap();
                }}
                className="w-full flex items-center gap-3 bg-surface-sunken border-2.5 border-dashed border-border-soft rounded-button px-4 py-3 text-left opacity-70"
              >
                <span className="w-10 h-10 rounded-full bg-surface-card text-neutral border-2 border-border-soft flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
                    lock
                  </span>
                </span>
                <span className="flex-1">
                  <span className="font-body text-body-strong text-ink-soft block">
                    {role.name}
                  </span>
                  <span className="font-body text-caption text-neutral">Coming soon 🔒</span>
                </span>
              </button>
            );
          })}
        </div>
      </BottomSheet>

      <BottomNav />
    </div>
  );
}
