"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { StepTracker } from "@/components/game/StepTracker";
import { ApiFieldError, register } from "@/lib/api";
import { Step1Account } from "@/components/signup/Step1Account";
import { Step2Profile } from "@/components/signup/Step2Profile";
import { Step3Koperasi } from "@/components/signup/Step3Koperasi";
import { Step4Referral } from "@/components/signup/Step4Referral";
import { Step5Celebration } from "@/components/signup/Step5Celebration";

export type SignupData = {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  email: string;
  provinceId: number | null;
  provinceName: string;
  cityId: number | null;
  cityName: string;
  koperasiId: number | null;
  koperasiName: string;
  referralCode: string;
};

const INITIAL: SignupData = {
  username: "",
  password: "",
  confirmPassword: "",
  name: "",
  phone: "",
  email: "",
  provinceId: null,
  provinceName: "",
  cityId: null,
  cityName: "",
  koperasiId: null,
  koperasiName: "",
  referralCode: "",
};

// Field yang dikembalikan backend saat validasi gagal, dipetakan balik ke step
// yang relevan supaya wizard otomatis mundur ke step yang error.
const FIELD_TO_STEP: Record<string, number> = {
  user_name: 1,
  password: 1,
  name: 2,
  phone_number: 2,
  email: 2,
  koperasi_id: 3,
  invite_code: 4,
};

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [data, setData] = useState<SignupData>(INITIAL);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bonusApplied, setBonusApplied] = useState(false);

  function update(patch: Partial<SignupData>) {
    setData((d) => ({ ...d, ...patch }));
  }

  function goNext() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 5));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleFinalSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await register({
        user_name: data.username.trim(),
        name: data.name.trim(),
        phone_number: data.phone.trim(),
        email: data.email.trim(),
        password: data.password,
        koperasi_id: data.koperasiId as number,
        invite_code: data.referralCode.trim() || undefined,
      });
      setBonusApplied(!!data.referralCode.trim());
      setFieldErrors({});
      setDirection(1);
      setStep(5);
    } catch (err) {
      if (err instanceof ApiFieldError) {
        const flat: Record<string, string> = {};
        let jumpTo = step;
        for (const [key, msgs] of Object.entries(err.fields)) {
          flat[key] = msgs[0];
          const mapped = FIELD_TO_STEP[key];
          if (mapped && mapped < jumpTo) jumpTo = mapped;
        }
        setFieldErrors(flat);
        setSubmitError(Object.values(flat)[0] ?? "Gagal mendaftar.");
        if (jumpTo !== step) {
          setDirection(-1);
          setStep(jumpTo);
        }
      } else {
        setSubmitError(err instanceof Error ? err.message : "Gagal mendaftar.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-surface text-ink font-body text-body min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow pt-20 pb-16 max-w-app mx-auto w-full px-md flex flex-col items-center justify-center">
        <div className="w-full max-w-[26rem]">
          {step < 5 && <StepTracker current={step} />}
          <div key={step} className={direction === 1 ? "animate-slide-in-right" : "animate-slide-in-left"}>
            {step === 1 && <Step1Account data={data} onChange={update} errors={fieldErrors} onNext={goNext} />}
            {step === 2 && (
              <Step2Profile data={data} onChange={update} errors={fieldErrors} onNext={goNext} onBack={goBack} />
            )}
            {step === 3 && (
              <Step3Koperasi data={data} onChange={update} errors={fieldErrors} onNext={goNext} onBack={goBack} />
            )}
            {step === 4 && (
              <Step4Referral
                data={data}
                onChange={update}
                onBack={goBack}
                onSubmit={handleFinalSubmit}
                submitting={submitting}
                submitError={submitError}
              />
            )}
            {step === 5 && <Step5Celebration bonusApplied={bonusApplied} />}
          </div>
        </div>
      </main>
    </div>
  );
}
