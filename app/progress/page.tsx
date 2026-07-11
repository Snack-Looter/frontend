"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { PageLoader } from "@/components/ui/PageLoader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PushButton } from "@/components/ui/PushButton";
import { useIsAuthed } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import {
  ApiError,
  getBattlePassStatus,
  getMissionHistory,
  getRoleProgress,
  type BattlePassStatus,
  type Mission,
  type RoleProgressResponse,
  type RoleSummary,
} from "@/lib/api";

const MISSIONS_PER_LEVEL = 5;

type RoleColor = "primary" | "secondary" | "tertiary";

// Ikon + warna aksen per role. Role yang tak dikenal tetap ter-render pakai
// fallback, supaya kartu selalu terisi apa adanya dari API (bukan slot kosong).
const ROLE_META: Record<string, { icon: string; color: RoleColor }> = {
  Affiliator: { icon: "storefront", color: "primary" },
  "Content Creator": { icon: "photo_camera", color: "secondary" },
  "Duta Sebaya": { icon: "diversity_3", color: "tertiary" },
};
const DEFAULT_ROLE_META = { icon: "workspace_premium", color: "primary" as RoleColor };

const ROLE_ICON_BG: Record<RoleColor, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

type TabKey = "role" | "history";
type HistoryFilter = "all" | "completed" | "failed";

const HISTORY_FILTERS: { key: HistoryFilter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "completed", label: "Berhasil" },
  { key: "failed", label: "Gagal" },
];

function icon(name: string, size = 20) {
  return (
    <span className="material-symbols-rounded" style={{ fontSize: size }}>
      {name}
    </span>
  );
}

export default function ProgressPage() {
  const { isAuthed, checked } = useIsAuthed();

  const [roleData, setRoleData] = useState<RoleProgressResponse | null>(null);
  const [history, setHistory] = useState<Mission[] | null>(null);
  const [battlePass, setBattlePass] = useState<BattlePassStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [tab, setTab] = useState<TabKey>("role");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");

  useEffect(() => {
    if (!checked || !isAuthed) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const [roles, hist, bp] = await Promise.all([
          getRoleProgress(),
          getMissionHistory(),
          getBattlePassStatus(),
        ]);
        if (cancelled) return;
        setRoleData(roles);
        setHistory(hist);
        setBattlePass(bp);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Gagal memuat progresmu.");
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

  const filteredHistory = useMemo(() => {
    if (!history) return [];
    if (historyFilter === "all") return history;
    return history.filter((m) => m.status === historyFilter);
  }, [history, historyFilter]);

  // --- Shell states (loading / belum login) -------------------------------
  if (!checked || (isAuthed && loading)) {
    return (
      <Shell>
        <PageLoader label="Memuat progresmu..." />
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
              Progres role dan riwayat misimu nunggu di sana — masuk dulu buat lihat.
            </p>
            <PushButton href="/chatbot" className="w-full mt-1">
              Masuk
            </PushButton>
          </Card>
        </div>
      </Shell>
    );
  }

  const totalXp = roleData?.total_xp ?? 0;
  const rewardLine =
    battlePass == null
      ? "Lihat semua reward kamu"
      : battlePass.xp_required_to_next != null
        ? `${battlePass.xp_required_to_next.toLocaleString("id-ID")} XP lagi buat reward berikutnya`
        : "Semua reward udah kebuka! 🎉";

  return (
    <Shell>
      {loadError && (
        <p className="font-body text-label text-danger text-center px-md mt-4">{loadError}</p>
      )}

      {/* Judul — ikut ter-scroll */}
      <section className="px-md pt-6 pb-4">
        <h1 className="font-display text-display text-ink">Progress Tracker</h1>
        <p className="font-body text-body text-ink-soft mt-1">
          Pantau XP, level tiap role, dan jejak misimu.
        </p>
      </section>

      {/* Blok sticky: Summary Total XP + Tab Switcher (tetap terlihat saat scroll) */}
      <div className="sticky top-16 z-40 bg-surface px-md pt-1 pb-3 border-b-2 border-border-soft">
        {/* Summary Card — bisa di-tap menuju Reward Center */}
        <Link
          href="/reward"
          className="block relative bg-surface-card border-2.5 border-ink rounded-card shadow-solid-md p-4 transition-all duration-100 active:translate-y-1 active:shadow-solid-sm"
        >
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
            <span className="text-neutral flex-shrink-0">{icon("chevron_right", 24)}</span>
          </div>
          <div className="mt-3 pt-3 border-t-2 border-border-soft flex items-center justify-between gap-2">
            <span className="font-body text-caption font-semibold text-ink-soft">{rewardLine}</span>
            <span className="text-primary flex-shrink-0">{icon("arrow_forward", 18)}</span>
          </div>
        </Link>

        {/* Tab Switcher — segmented control chunky */}
        <div className="mt-3 flex gap-1 p-1 bg-surface-sunken border-2.5 border-ink rounded-button">
          {(
            [
              { key: "role", label: "Progress Role" },
              { key: "history", label: "Riwayat Misi" },
            ] as { key: TabKey; label: string }[]
          ).map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex-1 font-body text-label font-semibold py-2 rounded-chip border-2 transition-colors duration-200 ${
                  active
                    ? "bg-primary text-white border-ink"
                    : "bg-transparent text-ink-soft border-transparent"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Konten tab — re-mount tiap ganti tab supaya ada transisi fade/slide singkat */}
      <div key={tab} className="px-md pt-5 animate-card-in">
        {tab === "role" ? (
          <RoleTab roles={roleData?.roles ?? []} />
        ) : (
          <HistoryTab
            all={history ?? []}
            filtered={filteredHistory}
            filter={historyFilter}
            onFilterChange={setHistoryFilter}
          />
        )}
      </div>
    </Shell>
  );
}

// --- Shell: header + main + bottom nav ------------------------------------
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface text-ink font-body text-body min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow pt-16 pb-28 max-w-app mx-auto w-full">{children}</main>
      <BottomNav />
    </div>
  );
}

// --- Tab A: Progress Role --------------------------------------------------
function RoleTab({ roles }: { roles: RoleSummary[] }) {
  if (roles.length === 0) {
    return (
      <MascotEmpty
        iconName="rocket_launch"
        title="Belum ada role aktif"
        description="Progres role kamu bakal muncul di sini begitu kamu mulai berpetualang."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {roles.map((role) => (
        <RoleProgressCard key={role.role_id} role={role} />
      ))}
    </div>
  );
}

function RoleProgressCard({ role }: { role: RoleSummary }) {
  const meta = ROLE_META[role.role_name] ?? DEFAULT_ROLE_META;
  const done = Math.max(0, MISSIONS_PER_LEVEL - role.missions_remaining_to_next_level);
  const percent = (done / MISSIONS_PER_LEVEL) * 100;

  return (
    <div className="relative bg-surface-card border-2.5 border-ink rounded-card shadow-solid-md p-5 flex flex-col gap-4">
      {/* Baris atas: ikon + nama + level, XP di kanan */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-12 h-12 rounded-button ${ROLE_ICON_BG[meta.color]} text-white border-2.5 border-ink flex items-center justify-center flex-shrink-0`}
          >
            {icon(meta.icon, 26)}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-title-sm text-ink truncate">{role.role_name}</h3>
            <Chip variant="level" className="mt-1">
              Level {role.current_level_number}
            </Chip>
          </div>
        </div>
        <span className="flex items-center gap-1 font-display font-bold text-stat text-secondary-dark flex-shrink-0">
          {icon("bolt", 18)}
          {role.role_xp.toLocaleString("id-ID")}
          <span className="font-body text-caption font-semibold text-ink-soft ml-0.5">XP</span>
        </span>
      </div>

      {/* Chip status berhasil / gagal */}
      <div className="flex flex-wrap gap-1.5">
        <Chip variant="success" icon={icon("check_circle", 14)}>
          {role.mission_completed_count} Berhasil
        </Chip>
        <Chip variant="danger" icon={icon("cancel", 14)}>
          {role.mission_failed_count} Gagal
        </Chip>
      </div>

      {/* Progress ke level berikutnya */}
      <div>
        <p className="font-body text-caption font-semibold text-ink-soft mb-1.5">
          {done}/{MISSIONS_PER_LEVEL} Misi ke Level {role.current_level_number + 1}
        </p>
        <ProgressBar percent={percent} />
      </div>
    </div>
  );
}

// --- Tab B: Riwayat Misi ---------------------------------------------------
function HistoryTab({
  all,
  filtered,
  filter,
  onFilterChange,
}: {
  all: Mission[];
  filtered: Mission[];
  filter: HistoryFilter;
  onFilterChange: (f: HistoryFilter) => void;
}) {
  // Belum ada riwayat sama sekali → empty state penuh dengan maskot.
  if (all.length === 0) {
    return (
      <MascotEmpty
        iconName="history"
        title="Riwayat masih kosong"
        description="Riwayat misi kamu bakal muncul di sini setelah misi pertama selesai."
      />
    );
  }

  return (
    <div>
      {/* Filter chip status */}
      <div className="flex gap-1.5 mb-4">
        {HISTORY_FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilterChange(f.key)}
              className={`font-body text-caption font-semibold px-3 py-1.5 rounded-chip border-2 border-ink transition-colors duration-150 ${
                active ? "bg-primary text-white" : "bg-surface-card text-ink-soft"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="font-body text-body text-ink-soft text-center py-8">
          {filter === "failed"
            ? "Belum ada misi yang gagal — mantap! 🎉"
            : "Belum ada misi yang berhasil di kategori ini."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((m) => (
            <HistoryMissionCard key={m.mission_id} mission={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryMissionCard({ mission }: { mission: Mission }) {
  const completed = mission.status === "completed";

  return (
    <Link
      href={`/mission/${mission.mission_id}?readonly=1`}
      className="block bg-surface-card border-2.5 border-ink rounded-card shadow-solid-sm p-4 transition-all duration-100 active:translate-y-0.5 active:shadow-none"
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-11 h-11 rounded-full ${
            completed ? "bg-secondary" : "bg-danger"
          } text-white border-2.5 border-ink flex items-center justify-center flex-shrink-0`}
        >
          {icon(completed ? "check" : "close", 22)}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <Chip variant={completed ? "success" : "danger"}>
              {completed ? "Berhasil" : "Gagal"}
            </Chip>
            <Chip variant="earth">{mission.role_name}</Chip>
          </div>
          <p className="font-body text-body-strong text-ink truncate">
            Jual {mission.target_quantity} {mission.product_name_snapshot}
          </p>
          <p className="font-body text-caption text-neutral mt-0.5">
            {formatDate(mission.completed_at ?? mission.created_at)}
          </p>
        </div>

        {/* XP hanya untuk yang berhasil; yang gagal di-strip (bukan "+0 XP") */}
        <div className="flex-shrink-0 text-right">
          {completed ? (
            <span className="font-display font-bold text-label text-secondary-dark whitespace-nowrap">
              +{mission.xp_reward} XP
            </span>
          ) : (
            <span className="font-body text-label text-neutral">—</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// --- Empty state dengan maskot --------------------------------------------
function MascotEmpty({
  iconName,
  title,
  description,
}: {
  iconName: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-12">
      <span className="w-20 h-20 rounded-full bg-primary-light text-primary border-3 border-ink shadow-solid-md flex items-center justify-center animate-bounce-in">
        {icon(iconName, 40)}
      </span>
      <h3 className="font-display text-title-sm text-ink">{title}</h3>
      <p className="font-body text-body text-ink-soft max-w-[16rem]">{description}</p>
    </div>
  );
}
