"use client";

import type { SignupData } from "@/app/register/page";
import { Card } from "@/components/ui/Card";
import { FieldInput } from "@/components/ui/FieldInput";
import { PushButton } from "@/components/ui/PushButton";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Step2Profile({
  data,
  onChange,
  errors,
  onNext,
  onBack,
}: {
  data: SignupData;
  onChange: (patch: Partial<SignupData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}) {
  const nameValid = data.name.trim().length >= 2;
  const phoneValid = data.phone.trim().length >= 8;
  const emailValid = EMAIL_RE.test(data.email.trim());

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!nameValid || !phoneValid || !emailValid) return;
    onNext();
  }

  return (
    <form onSubmit={handleNext}>
      <Card animate className="flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="font-body text-label text-neutral hover:text-primary transition-colors mb-2"
          >
            ← Kembali
          </button>
          <h2 className="font-display text-title text-ink">Siapa nama kamu?</h2>
          <p className="font-body text-body text-ink-soft mt-1">
            Biar tim koperasi kenal kamu dan bisa hubungi kalau perlu.
          </p>
        </div>

        <FieldInput
          label="Nama Lengkap"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          error={errors.name}
          valid={nameValid}
          placeholder="Nama sesuai KTP"
          autoFocus
        />
        <FieldInput
          label="No. HP"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          error={errors.phone_number}
          valid={phoneValid}
          placeholder="08xxxxxxxxxx"
        />
        <FieldInput
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          error={errors.email}
          valid={emailValid}
          placeholder="nama@email.com"
        />

        <PushButton type="submit" className="w-full mt-1">
          Lanjut
        </PushButton>
      </Card>
    </form>
  );
}
