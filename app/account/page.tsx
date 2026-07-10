"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/Card";
import { Chip, StickerTag } from "@/components/ui/Chip";
import { FieldInput } from "@/components/ui/FieldInput";
import { SelectField } from "@/components/ui/SelectField";
import { Modal, BottomSheet } from "@/components/ui/Modal";
import { PushButton } from "@/components/ui/PushButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { StatTile } from "@/components/game/StatTile";
import { LevelBadge } from "@/components/game/LevelBadge";
import { clearTokens, useIsAuthed } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import {
  ApiError,
  ApiFieldError,
  changePassword,
  getProfile,
  updateProfile,
  type Profile,
  type ProfileRole,
} from "@/lib/api";

const GENDER_LABELS: Record<string, string> = {
  male: "Laki-laki",
  female: "Perempuan",
};

const GENDER_OPTIONS = [
  { value: 0, label: "Laki-laki" },
  { value: 1, label: "Perempuan" },
];

function genderToCode(gender: string): number | "" {
  if (gender === "male") return 0;
  if (gender === "female") return 1;
  return "";
}

function codeToGender(code: number): string {
  return code === 0 ? "male" : "female";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RoleColor = "primary" | "secondary" | "tertiary";

// Sama seperti mapping role di app/progress/page.tsx — dipertahankan lokal
// di sini supaya ikon & warna tiap role tetap konsisten lintas halaman.
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

export default function AccountPage() {
  const { isAuthed, checked } = useIsAuthed();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    if (!checked || !isAuthed) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getProfile();
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Gagal memuat akunmu.");
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

  async function handleCopyInviteCode() {
    if (!profile) return;
    try {
      await navigator.clipboard.writeText(profile.invite_code);
      showToast("Kode undangan disalin!", "success");
    } catch {
      showToast("Gagal menyalin kode.", "danger");
    }
  }

  function handleLogout() {
    clearTokens();
    window.location.href = "/";
  }

  if (!checked || (isAuthed && loading)) {
    return (
      <div className="bg-surface text-ink font-body text-body min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-grow pt-16 pb-24 max-w-app mx-auto w-full px-md flex items-center justify-center">
          <p className="font-body text-body text-ink-soft">Memuat akunmu...</p>
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
              Akunmu nunggu di sana — masuk dulu buat lihat dan atur profilmu.
            </p>
            <PushButton href="/chatbot" className="w-full mt-1">
              Masuk
            </PushButton>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-surface text-ink font-body text-body min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-grow pt-16 pb-24 max-w-app mx-auto w-full px-md">
        {loadError && (
          <p className="font-body text-label text-danger text-center mt-6">{loadError}</p>
        )}

        {/* 1. Avatar + identitas singkat */}
        <section className="pt-8 pb-6">
          <p className="font-body text-label font-semibold text-primary mb-3">Akun Saya</p>
          <div className="flex items-center gap-4">
            <Avatar name={profile?.name ?? "?"} src={profile?.profile_picture || undefined} size={64} />
            <div className="min-w-0">
              <h1 className="font-display text-display text-ink truncate">
                {profile?.name ?? "Akun"}
              </h1>
              <p className="font-body text-body text-ink-soft truncate">
                @{profile?.user_name} · {profile?.koperasi_name}
              </p>
            </div>
          </div>
        </section>

        {/* 2. Ringkasan level & XP */}
        <section className="pb-8">
          <div className="flex gap-3 items-stretch">
            <LevelBadge
              level={profile?.top_role?.current_level_number ?? 1}
              label={profile?.top_role?.role_name ?? "LEVEL"}
              size={76}
            />
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
          <div className="grid grid-cols-2 gap-3 mt-3">
            <StatTile
              label="Role Aktif"
              value={profile?.roles.length ?? 0}
              icon={
                <span className="material-symbols-rounded" style={{ fontSize: 15 }}>
                  diversity_3
                </span>
              }
            />
            <StatTile
              label="Battle Pass"
              value={`Tier ${profile?.battle_pass_tier ?? 0}`}
              icon={
                <span className="material-symbols-rounded" style={{ fontSize: 15 }}>
                  military_tech
                </span>
              }
            />
          </div>
        </section>

        {profile && (
          <>
            {/* 3. Role & pencapaian */}
            <section className="pb-8">
              <h3 className="font-display text-title text-ink mb-4">Role & Pencapaian</h3>
              {profile.roles.length === 0 ? (
                <EmptyState
                  icon={
                    <span className="material-symbols-rounded" style={{ fontSize: 28 }}>
                      diversity_3
                    </span>
                  }
                  title="Belum ada role"
                  description="Role yang kamu mainkan bakal muncul di sini begitu kamu mulai berpetualang."
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {profile.roles.map((role) => (
                    <RoleRow
                      key={role.role_id}
                      role={role}
                      isTop={role.role_id === profile.top_role?.role_id}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* 4. Info akun */}
            <section className="pb-8">
              <h3 className="font-display text-title text-ink mb-4">Info Akun</h3>
              <Card className="flex flex-col">
                <InfoRow icon="badge" label="Username" value={`@${profile.user_name}`} />
                <InfoRow
                  icon="wc"
                  label="Jenis Kelamin"
                  value={GENDER_LABELS[profile.gender] ?? "Belum diatur"}
                />
                <InfoRow icon="call" label="No. HP" value={profile.phone_number || "-"} />
                <InfoRow icon="mail" label="Email" value={profile.email} />
                <InfoRow icon="storefront" label="Koperasi" value={profile.koperasi_name} />
                <InfoRow
                  icon="calendar_month"
                  label="Bergabung Sejak"
                  value={formatDate(profile.created_at)}
                />
                <InfoRow
                  icon="card_giftcard"
                  label="Kode Undangan"
                  value={profile.invite_code}
                  action={
                    <button
                      type="button"
                      onClick={handleCopyInviteCode}
                      aria-label="Salin kode undangan"
                      className="w-9 h-9 rounded-full bg-surface-sunken border-2 border-ink flex items-center justify-center flex-shrink-0 active:translate-y-0.5 transition-transform duration-100"
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: 16 }}>
                        content_copy
                      </span>
                    </button>
                  }
                />
              </Card>
            </section>

            {/* 5. Keamanan */}
            <section className="pb-8">
              <h3 className="font-display text-title text-ink mb-4">Keamanan</h3>
              <Card className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-full bg-surface-sunken text-ink-soft border-2 border-ink flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
                      lock
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="font-body text-body-strong text-ink">Password</p>
                    <p className="font-body text-caption text-ink-soft">
                      Ganti password akunmu secara berkala.
                    </p>
                  </div>
                </div>
                <PushButton size="sm" variant="secondary" onClick={() => setPasswordOpen(true)}>
                  Ubah
                </PushButton>
              </Card>
            </section>

            {/* 6. Aksi */}
            <section className="pb-8">
              <h3 className="font-display text-title text-ink mb-4">Aksi</h3>
              <div className="flex flex-col gap-3">
                <PushButton
                  variant="secondary"
                  onClick={() => setEditOpen(true)}
                  icon={
                    <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
                      edit
                    </span>
                  }
                  className="w-full"
                >
                  Edit Profil
                </PushButton>
                <PushButton
                  variant="danger"
                  onClick={handleLogout}
                  icon={
                    <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
                      logout
                    </span>
                  }
                  className="w-full"
                >
                  Keluar
                </PushButton>
              </div>
            </section>
          </>
        )}
      </main>

      {profile && editOpen && (
        <EditProfileSheet
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSaved={setProfile}
        />
      )}
      {passwordOpen && <ChangePasswordModal onClose={() => setPasswordOpen(false)} />}

      <BottomNav />
    </div>
  );
}

// --- Baris role individual, pengganti RoleCard (yang butuh description &
// tidak dirancang untuk menampilkan role yang sudah dimiliki) -------------
function RoleRow({ role, isTop }: { role: ProfileRole; isTop: boolean }) {
  const meta = ROLE_META[role.role_name] ?? DEFAULT_ROLE_META;
  return (
    <Card className="flex items-center gap-3">
      {isTop && <StickerTag variant="primary">Role Utama</StickerTag>}
      <span
        className={`w-11 h-11 rounded-full ${ROLE_ICON_BG[meta.color]} text-white border-2.5 border-ink flex items-center justify-center flex-shrink-0`}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
          {meta.icon}
        </span>
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h4 className="font-display text-title-sm text-ink truncate">{role.role_name}</h4>
          <Chip variant="level">Level {role.current_level_number}</Chip>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          <Chip
            variant="success"
            icon={
              <span className="material-symbols-rounded" style={{ fontSize: 14 }}>
                check_circle
              </span>
            }
          >
            {role.mission_completed_count} Berhasil
          </Chip>
          <Chip
            variant="danger"
            icon={
              <span className="material-symbols-rounded" style={{ fontSize: 14 }}>
                cancel
              </span>
            }
          >
            {role.mission_failed_count} Gagal
          </Chip>
        </div>
      </div>
      <span className="flex items-center gap-1 font-display font-bold text-label text-secondary-dark flex-shrink-0">
        <span className="material-symbols-rounded" style={{ fontSize: 16 }}>
          bolt
        </span>
        {role.role_xp.toLocaleString("id-ID")}
      </span>
    </Card>
  );
}

// --- Baris info akun read-only, dipakai berulang di dalam satu Card ------
function InfoRow({
  icon,
  label,
  value,
  action,
}: {
  icon: string;
  label: string;
  value: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b-2 border-border-soft last:border-b-0 last:pb-0 first:pt-0">
      <span className="w-9 h-9 rounded-full bg-surface-sunken text-ink-soft border-2 border-ink flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-rounded" style={{ fontSize: 16 }}>
          {icon}
        </span>
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-caption text-ink-soft">{label}</p>
        <p className="font-body text-body-strong text-ink truncate">{value}</p>
      </div>
      {action}
    </div>
  );
}

// --- Form edit profil, dalam BottomSheet ----------------------------------
// Cuma di-mount selagi sheet terbuka (lihat pemanggilnya) — jadi tiap kali
// dibuka lagi, komponen ini mount baru dan useState di bawah otomatis mulai
// dari data profil terbaru, tanpa perlu effect buat reset state manual.
function EditProfileSheet({
  profile,
  onClose,
  onSaved,
}: {
  profile: Profile;
  onClose: () => void;
  onSaved: (updated: Profile) => void;
}) {
  const { showToast } = useToast();
  const [name, setName] = useState(profile.name);
  const [gender, setGender] = useState(profile.gender);
  const [phone, setPhone] = useState(profile.phone_number);
  const [email, setEmail] = useState(profile.email);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const nameValid = name.trim().length >= 2;
  const phoneValid = phone.trim().length >= 8;
  const emailValid = EMAIL_RE.test(email.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameValid || !phoneValid || !emailValid) return;
    setSubmitting(true);
    setErrors({});
    try {
      const updated = await updateProfile({ name, gender, phone_number: phone, email });
      showToast("Profil berhasil diperbarui!", "success");
      onSaved(updated);
      onClose();
    } catch (err) {
      if (err instanceof ApiFieldError) {
        const flat: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.fields)) flat[key] = msgs[0];
        setErrors(flat);
      } else {
        showToast(err instanceof ApiError ? err.message : "Gagal memperbarui profil.", "danger");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BottomSheet open onClose={onClose} title="Edit Profil">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldInput
          label="Nama Lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          valid={nameValid}
          placeholder="Nama sesuai KTP"
        />
        <SelectField
          label="Jenis Kelamin"
          value={genderToCode(gender)}
          onChange={(code) => setGender(codeToGender(code))}
          options={GENDER_OPTIONS}
          placeholder="Pilih jenis kelamin"
          error={errors.gender}
        />
        <FieldInput
          label="No. HP"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone_number}
          valid={phoneValid}
          placeholder="08xxxxxxxxxx"
        />
        <FieldInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          valid={emailValid}
          placeholder="nama@email.com"
        />
        <PushButton type="submit" loading={submitting} className="w-full mt-1">
          Simpan Perubahan
        </PushButton>
      </form>
    </BottomSheet>
  );
}

// --- Form ubah password, dalam Modal --------------------------------------
// Sama seperti EditProfileSheet: cuma di-mount selagi modal terbuka, jadi
// state password selalu mulai kosong tanpa perlu effect reset manual.
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const { showToast } = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const newPasswordValid = newPassword.length >= 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (oldPassword.length === 0 || !newPasswordValid) return;
    setSubmitting(true);
    setErrors({});
    try {
      await changePassword({ old_password: oldPassword, new_password: newPassword });
      showToast("Password berhasil diganti!", "success");
      onClose();
    } catch (err) {
      if (err instanceof ApiFieldError) {
        const flat: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.fields)) flat[key] = msgs[0];
        setErrors(flat);
      } else {
        showToast(err instanceof ApiError ? err.message : "Gagal mengganti password.", "danger");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Ubah Password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldInput
          label="Password Lama"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          error={errors.old_password}
          placeholder="Masukkan password saat ini"
        />
        <FieldInput
          label="Password Baru"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.new_password}
          valid={newPasswordValid}
          placeholder="Minimal 8 karakter"
        />
        <PushButton type="submit" loading={submitting} className="w-full mt-1">
          Simpan Password Baru
        </PushButton>
      </form>
    </Modal>
  );
}
