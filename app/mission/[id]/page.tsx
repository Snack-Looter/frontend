"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageLoader } from "@/components/ui/PageLoader";
import { Chip, StickerTag } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PushButton } from "@/components/ui/PushButton";
import { CelebrationOverlay } from "@/components/game/CelebrationOverlay";
import { useToast } from "@/components/ui/Toast";
import { daysRemaining, formatRupiah } from "@/lib/format";
import { ApiError, getMission, verifyMissionProgress, type Mission } from "@/lib/api";

const RULES = [
  "Progress dihitung otomatis dari transaksi yang tervalidasi kasir koperasi.",
  "Misi gagal otomatis kalau deadline lewat sebelum target tercapai.",
  "XP baru ditambahkan setelah target tercapai dan diverifikasi.",
  "Satu role cuma bisa punya 1 misi berjalan dalam satu waktu.",
];

export default function MissionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const missionId = Number(params.id);

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [outcome, setOutcome] = useState<"success" | "fail" | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getMission(missionId);
        if (!cancelled) setMission(data);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 404) {
            setNotFound(true);
          } else {
            showToast(err instanceof ApiError ? err.message : "Gagal memuat misi.", "danger");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (Number.isFinite(missionId)) load();
    else {
      setNotFound(true);
      setLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [missionId]);

  async function handleVerify(forceSuccess?: boolean) {
    if (!mission) return;
    setVerifying(true);
    try {
      const updated = await verifyMissionProgress(mission.mission_id, forceSuccess);
      setMission(updated);
      if (updated.status === "completed") {
        setOutcome("success");
      } else if (updated.status === "failed") {
        setOutcome("fail");
      } else {
        showToast("Target belum tercapai, terus semangat jualan!", "info");
      }
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Gagal memeriksa progress.", "danger");
    } finally {
      setVerifying(false);
    }
  }

  async function handleCopyReferralCode() {
    if (!mission) return;
    try {
      await navigator.clipboard.writeText(mission.referral_code);
      showToast("Kode referral disalin!", "success");
    } catch {
      showToast("Gagal menyalin kode.", "danger");
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface text-ink font-body text-body max-w-app mx-auto w-full">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center gap-2 h-16 px-md border-b-2 border-ink">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-sunken transition-colors -ml-2"
          aria-label="Kembali"
        >
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
        <h1 className="font-display text-title-sm text-ink">Detail Misi</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-md py-5">
        {loading && <PageLoader label="Memuat misi..." />}

        {!loading && notFound && (
          <Card className="text-center flex flex-col items-center gap-3 mt-8">
            <span className="w-16 h-16 rounded-full bg-surface-sunken text-neutral border-2.5 border-ink flex items-center justify-center">
              <span className="material-symbols-rounded" style={{ fontSize: 32 }}>
                search_off
              </span>
            </span>
            <h2 className="font-display text-title text-ink">Misi tidak ditemukan</h2>
            <p className="font-body text-body text-ink-soft">
              Misi ini mungkin sudah tidak ada atau bukan milikmu.
            </p>
            <PushButton href="/home" className="w-full mt-1">
              Kembali ke Beranda
            </PushButton>
          </Card>
        )}

        {!loading && mission && (
          <>
            {/* Status badge */}
            <div className="flex justify-center mb-5">
              {mission.status === "completed" ? (
                <Chip
                  variant="success"
                  icon={
                    <span className="material-symbols-rounded" style={{ fontSize: 16 }}>
                      check_circle
                    </span>
                  }
                  className="!text-label !px-4 !py-1.5"
                >
                  Selesai
                </Chip>
              ) : mission.status === "failed" ? (
                <Chip variant="danger" className="!text-label !px-4 !py-1.5">
                  Gagal
                </Chip>
              ) : (
                <Chip variant="success" className="!text-label !px-4 !py-1.5">
                  Sedang Berjalan
                </Chip>
              )}
            </div>

            {/* Objective card — konsolidasi */}
            <Card variant="hero" className="flex flex-col gap-3 mb-6">
              <StickerTag
                onClick={() =>
                  showToast("Misi ini dibuat otomatis oleh AI sesuai role dan levelmu.", "info")
                }
                className="cursor-pointer"
              >
                Dibuat ML ✨
              </StickerTag>

              <div className="flex flex-wrap gap-1.5">
                <Chip variant="earth">{mission.role_name}</Chip>
                <Chip variant="primary-soft">Level {mission.current_level_number}</Chip>
              </div>

              <h2 className="font-display text-title text-ink">
                Jual {mission.target_quantity} {mission.product_name_snapshot}
              </h2>
              <p className="font-body text-caption text-ink-soft">
                Capai target penjualan sebelum deadline buat dapetin XP.
              </p>

              <div className="flex flex-wrap gap-1.5">
                <Chip variant="success">+{mission.xp_reward} XP</Chip>
                <Chip variant="earth">Target Rp{formatRupiah(mission.target_gmv)}</Chip>
                <Chip variant="primary-soft">{mission.target_quantity} pcs</Chip>
                {mission.status === "ongoing" &&
                  (() => {
                    const days = daysRemaining(mission.deadline_date);
                    const urgent = days <= 2;
                    return (
                      <Chip
                        variant={urgent ? "warning" : "neutral"}
                        className={urgent ? "animate-pulse" : ""}
                      >
                        {days} Hari Tersisa
                      </Chip>
                    );
                  })()}
              </div>

              <ProgressBar
                percent={
                  (mission.current_quantity / Math.max(mission.target_quantity, 1)) * 100
                }
              />
              <p className="font-body text-caption text-ink-soft">
                {mission.current_quantity}/{mission.target_quantity} terjual
              </p>
            </Card>

            {/* Kode Referral — cuma relevan selama mission masih ongoing */}
            {mission.status === "ongoing" && (
              <div className="border-2.5 border-ink rounded-card bg-surface-card p-4 mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="font-body text-caption text-ink-soft mb-1">Kode Referral</p>
                  <p className="font-display text-title text-primary tracking-[0.3em]">
                    {mission.referral_code}
                  </p>
                  <p className="font-body text-caption text-ink-soft mt-1">
                    Tunjukkan kode ini ke kasir saat belanja di koperasi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyReferralCode}
                  aria-label="Salin kode referral"
                  className="w-10 h-10 rounded-full bg-surface-sunken border-2 border-ink flex items-center justify-center flex-shrink-0 active:translate-y-0.5 transition-transform duration-100"
                >
                  <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
                    content_copy
                  </span>
                </button>
              </div>
            )}

            {/* AI helper — satu baris ramping */}
            <Link
              href="/chatbot"
              className="flex items-center gap-3 bg-primary-light border-2.5 border-primary rounded-button px-4 py-3 mb-6"
            >
              <span className="w-10 h-10 rounded-full bg-primary text-white border-2 border-ink flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
                  psychology
                </span>
              </span>
              <span className="flex-1 font-body text-label font-semibold text-primary-dark">
                Butuh ide promosi? Tanya AI
              </span>
              <span className="font-body text-label font-bold text-primary flex items-center gap-1 flex-shrink-0">
                Buka Chat
                <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
                  chevron_right
                </span>
              </span>
            </Link>

            {/* Aturan Misi — accordion, collapsed by default */}
            <div className="border-2.5 border-ink rounded-card overflow-hidden mb-6">
              <button
                type="button"
                onClick={() => setRulesOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface-card"
              >
                <span className="font-body text-label font-semibold text-ink">Aturan Misi</span>
                <span
                  className="material-symbols-rounded transition-transform duration-200"
                  style={{ transform: rulesOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  expand_more
                </span>
              </button>
              {rulesOpen && (
                <div className="px-4 pb-4 pt-3 border-t-2 border-border-soft flex flex-col gap-2">
                  {RULES.map((rule) => (
                    <p
                      key={rule}
                      className="font-body text-caption text-ink-soft flex items-start gap-2"
                    >
                      <span className="text-primary flex-shrink-0">•</span>
                      {rule}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Sticky bottom CTA */}
      {!loading && mission && (
        <div className="flex-shrink-0 border-t-2.5 border-ink bg-surface p-md">
          {mission.status === "ongoing" ? (
            <div className="flex flex-col gap-3">
              <PushButton onClick={() => handleVerify()} loading={verifying} className="w-full">
                Verifikasi Progress
              </PushButton>

              <div className="border-2 border-dashed border-border-soft rounded-button bg-surface-sunken p-3 flex flex-col gap-2">
                <p className="font-body text-caption text-ink-soft text-center font-semibold">
                  pilih hasil untuk simulasi tanpa transaksi asli
                </p>
                <div className="flex gap-3">
                  <PushButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleVerify(true)}
                    loading={verifying}
                    className="flex-1"
                  >
                    Demo Sukses
                  </PushButton>
                  <PushButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleVerify(false)}
                    loading={verifying}
                    className="flex-1"
                  >
                    Demo Gagal
                  </PushButton>
                </div>
              </div>
            </div>
          ) : (
            <p className="font-body text-body-strong text-ink-soft text-center py-2">
              {mission.status === "completed"
                ? "Misi ini sudah selesai 🎉"
                : "Misi ini sudah berakhir."}
            </p>
          )}
        </div>
      )}

      {/* Hasil demo sukses — tetap di halaman, navigasi ke Home dikontrol manual lewat tombol Lanjut */}
      {outcome === "success" && mission && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-md">
          <div
            className="absolute inset-0 bg-ink/50 animate-overlay-in"
            onClick={() => setOutcome(null)}
          />
          <div className="relative w-full max-w-[24rem]">
            <CelebrationOverlay
              icon={
                <span className="material-symbols-rounded" style={{ fontSize: 40 }}>
                  celebration
                </span>
              }
              title="Misi Selesai!"
              subtitle="Target tercapai, kerja bagus!"
              xp={mission.xp_reward}
            >
              <PushButton className="w-full mt-4" onClick={() => router.push("/home")}>
                Lanjut
              </PushButton>
            </CelebrationOverlay>
          </div>
        </div>
      )}

      {/* Hasil demo gagal — nada tetap positif, bukan menghukum */}
      {outcome === "fail" && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-md">
          <div
            className="absolute inset-0 bg-ink/50 animate-overlay-in"
            onClick={() => setOutcome(null)}
          />
          <div className="relative w-full max-w-[24rem]">
            <div className="relative bg-surface-card border-3 border-ink rounded-card shadow-solid-lg p-8 flex flex-col items-center text-center gap-3 animate-card-in">
              <span className="w-20 h-20 rounded-full bg-tertiary-light text-tertiary-dark border-3 border-ink shadow-solid-md flex items-center justify-center">
                <span className="material-symbols-rounded" style={{ fontSize: 40 }}>
                  sentiment_neutral
                </span>
              </span>
              <h2 className="font-display text-title text-ink">Belum Berhasil</h2>
              <p className="font-body text-body text-ink-soft">
                Belum berhasil kali ini, coba misi berikutnya!
              </p>
              <PushButton className="w-full mt-4" onClick={() => router.push("/home")}>
                Lanjut
              </PushButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
