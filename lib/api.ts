import { clearTokens, getAccessToken } from "./auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type FieldErrors = Record<string, string[]>;

// Menormalkan body error DRF (mis. { user_name: ["sudah dipakai."] } atau
// { detail: "..." }) jadi satu bentuk yang gampang dipetakan ke field/step.
export class ApiFieldError extends ApiError {
  fields: FieldErrors;
  constructor(status: number, data: unknown) {
    const fields: FieldErrors = {};
    if (data && typeof data === "object") {
      for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
        fields[key] = Array.isArray(val) ? val.map(String) : [String(val)];
      }
    }
    const first = Object.values(fields)[0]?.[0] ?? "Gagal mendaftar.";
    super(status, first);
    this.fields = fields;
  }
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new ApiError(res.status, "Email atau password salah.");
  }
  return (await res.json()) as { access: string; refresh: string };
}

export type Province = { province_id: number; province_name: string };
export type City = { city_id: number; city_name: string };
export type Koperasi = {
  koperasi_id: number;
  koperasi_name: string;
  address: string | null;
};

export async function getProvinces(): Promise<Province[]> {
  const res = await fetch(`${API_BASE_URL}/api/auth/provinces/`);
  if (!res.ok) throw new ApiError(res.status, "Gagal memuat daftar provinsi.");
  return res.json();
}

export async function getCities(provinceId: number): Promise<City[]> {
  const res = await fetch(`${API_BASE_URL}/api/auth/provinces/${provinceId}/cities/`);
  if (!res.ok) throw new ApiError(res.status, "Gagal memuat daftar kota.");
  return res.json();
}

export async function getKoperasiList(cityId: number): Promise<Koperasi[]> {
  const res = await fetch(`${API_BASE_URL}/api/auth/cities/${cityId}/koperasi/`);
  if (!res.ok) throw new ApiError(res.status, "Gagal memuat daftar koperasi.");
  return res.json();
}

export type RegisterPayload = {
  user_name: string;
  name: string;
  phone_number: string;
  email: string;
  password: string;
  koperasi_id: number;
  invite_code?: string;
};

export type RegisterResult = {
  user_name: string;
  name: string;
  email: string;
};

export async function register(payload: RegisterPayload): Promise<RegisterResult> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiFieldError(res.status, data);
  }
  return data;
}

// Fetch ke endpoint yang butuh login. Menyisipkan Bearer token, dan kalau
// backend balas 401 langsung bersihkan token (sesi habis) sebelum melempar.
async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    throw new ApiError(401, "Belum login.");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    clearTokens();
    throw new ApiError(401, "Sesi berakhir, silakan login lagi.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiFieldError(res.status, data);
  }
  return data as T;
}

export async function sendChatMessage(message: string): Promise<string> {
  const data = await authFetch<{ reply: string }>("/api/chat/", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  return data.reply;
}

export type ProfileRole = {
  role_id: number;
  role_name: string;
  current_level_number: number;
  role_xp: number;
  mission_completed_count: number;
  mission_failed_count: number;
};

export type Profile = {
  user_id: number;
  name: string;
  user_name: string;
  gender: string;
  phone_number: string;
  email: string;
  profile_picture: string;
  created_at: string;
  total_xp: number;
  invite_code: string;
  roles: ProfileRole[];
  koperasi_name: string;
  top_role: { role_id: number; role_name: string; current_level_number: number } | null;
  battle_pass_tier: number;
};

export type RoleInfo = { role_id: number; role_name: string; description: string };

export type RoleSummary = {
  role_id: number;
  role_name: string;
  current_level_number: number;
  role_xp: number;
  mission_completed_count: number;
  mission_failed_count: number;
  missions_remaining_to_next_level: number;
};

export type Mission = {
  mission_id: number;
  role_name: string;
  current_level_number: number;
  xp_reward: number;
  product_name_snapshot: string;
  product_price_snapshot: string;
  target_quantity: number;
  target_gmv: string;
  deadline_date: string;
  current_quantity: number;
  current_gmv: string;
  status: "ongoing" | "completed" | "failed";
  created_at: string;
  completed_at: string | null;
  referral_code: string;
};

export function getProfile(): Promise<Profile> {
  return authFetch<Profile>("/api/auth/profile/");
}

export type ProfileUpdatePayload = {
  name: string;
  gender: string;
  phone_number: string;
  email: string;
};

export function updateProfile(payload: ProfileUpdatePayload): Promise<Profile> {
  return authFetch<Profile>("/api/auth/profile/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
};

// Backend balas 204 No Content tanpa body kalau sukses — authFetch sudah
// aman menangani ini (res.json() gagal parse ditangkap jadi {}).
export function changePassword(payload: ChangePasswordPayload): Promise<void> {
  return authFetch<void>("/api/auth/change-password/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getRoles(): Promise<RoleInfo[]> {
  return authFetch<RoleInfo[]>("/api/roles/");
}

export function getRoleSummary(roleId: number): Promise<RoleSummary> {
  return authFetch<RoleSummary>(`/api/roles/${roleId}/summary/`);
}

export function getActiveMission(roleId: number): Promise<{ active_mission: Mission | null }> {
  return authFetch(`/api/roles/${roleId}/active-mission/`);
}

export function generateMission(roleId: number): Promise<Mission> {
  return authFetch<Mission>("/api/missions/generate/", {
    method: "POST",
    body: JSON.stringify({ role_id: roleId }),
  });
}

export function getMission(missionId: number): Promise<Mission> {
  return authFetch<Mission>(`/api/missions/${missionId}/`);
}

// Mengecek apakah target misi sudah tercapai (dihitung dari transaksi POS
// asli yang tervalidasi lewat referral_code, bukan dari panggilan ini).
// Selalu 200 selama mission masih ongoing — status di response bisa tetap
// "ongoing" kalau target belum tercapai, itu bukan error.
//
// forceSuccess: override untuk tombol demo "Demo Sukses"/"Demo Gagal" — saat
// diisi, backend melewati cek transaksi POS asli dan langsung memutuskan
// completed/failed sesuai nilainya. Dibiarkan undefined untuk verifikasi
// natural (dipakai lagi begitu integrasi POS jadi satu-satunya sumber).
export function verifyMissionProgress(
  missionId: number,
  forceSuccess?: boolean,
): Promise<Mission> {
  return authFetch<Mission>(`/api/missions/${missionId}/verify/`, {
    method: "POST",
    body: forceSuccess === undefined ? undefined : JSON.stringify({ force_success: forceSuccess }),
  });
}

export type BattlePassMilestone = {
  milestone_id: number;
  total_xp_threshold: number;
  reward_description: string;
  unlocked: boolean;
  unlocked_at: string | null;
  redeemed_at: string | null;
};

export type BattlePassStatus = {
  total_xp: number;
  current_tier: number;
  next_reward: string | null;
  xp_required_to_next: number | null;
  roadmap: BattlePassMilestone[];
};

export function getBattlePassStatus(): Promise<BattlePassStatus> {
  return authFetch<BattlePassStatus>("/api/progress/battle-pass/");
}

// Tab "Progress Role" di Progress Tracker. `roles` cuma berisi role yang
// benar-benar dimiliki player (satu PlayerRole per baris) — bukan slot kosong.
export type RoleProgressResponse = {
  total_xp: number;
  roles: RoleSummary[];
};

export function getRoleProgress(): Promise<RoleProgressResponse> {
  return authFetch<RoleProgressResponse>("/api/progress/roles/");
}

// Tab "Riwayat Misi". Backend sudah mengecualikan mission ongoing dan
// mengurutkan terbaru dulu, jadi FE tinggal render apa adanya.
export function getMissionHistory(): Promise<Mission[]> {
  return authFetch<Mission[]>("/api/missions/history/");
}
