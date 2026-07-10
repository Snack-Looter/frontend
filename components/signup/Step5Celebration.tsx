import { CelebrationOverlay } from "@/components/game/CelebrationOverlay";
import { PushButton } from "@/components/ui/PushButton";

// 50 XP cocok dengan starting XP hardcoded di backend
// (RegisterSerializer.create, apps/accounts/serializers.py) — kalau nilai itu
// berubah, angka di sini perlu ikut disesuaikan manual (response register
// tidak mengembalikan total_xp aktual).
const STARTING_XP = 50;
const REFERRAL_BONUS_XP = 25;

export function Step5Celebration({ bonusApplied }: { bonusApplied: boolean }) {
  return (
    <CelebrationOverlay
      icon={
        <span className="material-symbols-rounded" style={{ fontSize: 40 }}>
          military_tech
        </span>
      }
      title="Kamu siap main!"
      subtitle="Akun berhasil dibuat. Ini bekal awalmu:"
      xp={STARTING_XP}
      bonusXp={bonusApplied ? REFERRAL_BONUS_XP : undefined}
      bonusLabel="bonus dari kode referral!"
    >
      <PushButton href="/chatbot" className="w-full mt-4">
        Lanjut ke Masuk
      </PushButton>
    </CelebrationOverlay>
  );
}
