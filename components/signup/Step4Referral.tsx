"use client";

import type { SignupData } from "@/app/register/page";
import { Card } from "@/components/ui/Card";
import { FieldInput } from "@/components/ui/FieldInput";
import { PushButton } from "@/components/ui/PushButton";

export function Step4Referral({
  data,
  onChange,
  onBack,
  onSubmit,
  submitting,
  submitError,
}: {
  data: SignupData;
  onChange: (patch: Partial<SignupData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  function handleSkip() {
    onChange({ referralCode: "" });
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card animate className="flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="font-body text-label text-neutral hover:text-primary transition-colors mb-2 disabled:opacity-50"
          >
            ← Kembali
          </button>
          <h2 className="font-display text-title text-ink">Ada kode referral?</h2>
          <p className="font-body text-body text-ink-soft mt-1">
            Masukkan kode teman buat dapat bonus XP. Boleh dilewati kalau tidak ada.
          </p>
        </div>

        <FieldInput
          label="Kode Referral (opsional)"
          value={data.referralCode}
          onChange={(e) => onChange({ referralCode: e.target.value })}
          placeholder="Username temanmu"
          autoFocus
        />

        {submitError && <p className="font-body text-label text-danger">{submitError}</p>}

        <div className="flex flex-col gap-2 mt-1">
          <PushButton type="submit" loading={submitting} className="w-full">
            {submitting ? "Mendaftarkan..." : "Daftar Sekarang"}
          </PushButton>
          <button
            type="button"
            onClick={handleSkip}
            disabled={submitting}
            className="font-body text-label font-semibold text-neutral hover:text-primary transition-colors py-2 disabled:opacity-50"
          >
            Lewati dulu
          </button>
        </div>
      </Card>
    </form>
  );
}
