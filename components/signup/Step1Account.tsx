"use client";

import { useState } from "react";
import type { SignupData } from "@/app/register/page";
import { Card } from "@/components/ui/Card";
import { FieldInput } from "@/components/ui/FieldInput";
import { PushButton } from "@/components/ui/PushButton";

function passwordStrength(pw: string): { label: string; color: string; score: number } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Lemah", color: "bg-danger", score };
  if (score <= 2) return { label: "Cukup", color: "bg-warning", score };
  return { label: "Kuat", color: "bg-secondary", score };
}

export function Step1Account({
  data,
  onChange,
  errors,
  onNext,
}: {
  data: SignupData;
  onChange: (patch: Partial<SignupData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
}) {
  const [localError, setLocalError] = useState<string | null>(null);
  const strength = passwordStrength(data.password);
  const usernameValid = data.username.trim().length >= 3;
  const passwordValid = data.password.length >= 8;
  const confirmValid = data.confirmPassword.length > 0 && data.confirmPassword === data.password;

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!usernameValid) {
      setLocalError("Username minimal 3 karakter.");
      return;
    }
    if (!passwordValid) {
      setLocalError("Password minimal 8 karakter.");
      return;
    }
    if (!confirmValid) {
      setLocalError("Konfirmasi password tidak cocok.");
      return;
    }
    setLocalError(null);
    onNext();
  }

  return (
    <form onSubmit={handleNext}>
      <Card animate className="flex flex-col gap-4">
        <div>
          <h2 className="font-display text-title text-ink">Kenalan dulu yuk</h2>
          <p className="font-body text-body text-ink-soft mt-1">
            Bikin username dan password buat akun KopQuest kamu.
          </p>
        </div>

        <FieldInput
          label="Username"
          value={data.username}
          onChange={(e) => onChange({ username: e.target.value })}
          error={errors.user_name}
          valid={usernameValid}
          placeholder="mis. budi_koperasi"
          autoFocus
        />

        <div className="flex flex-col gap-1.5">
          <FieldInput
            label="Password"
            type="password"
            value={data.password}
            onChange={(e) => onChange({ password: e.target.value })}
            error={errors.password}
            valid={passwordValid}
            placeholder="Minimal 8 karakter"
          />
          {data.password.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-grow bg-surface-sunken rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                />
              </div>
              <span className="font-body text-caption text-ink-soft">{strength.label}</span>
            </div>
          )}
        </div>

        <FieldInput
          label="Konfirmasi Password"
          type="password"
          value={data.confirmPassword}
          onChange={(e) => onChange({ confirmPassword: e.target.value })}
          valid={confirmValid}
          placeholder="Ulangi password"
        />

        {localError && <p className="font-body text-label text-danger">{localError}</p>}

        <PushButton type="submit" className="w-full mt-1">
          Lanjut
        </PushButton>
      </Card>
    </form>
  );
}
