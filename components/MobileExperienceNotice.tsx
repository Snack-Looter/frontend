"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { PushButton } from "@/components/ui/PushButton";

// Ditampilkan sekali per sesi, hanya di layar lebar (desktop). Di HP tak perlu
// karena penggunanya memang sudah mobile.
const SESSION_KEY = "kopquest.mobileNoticeSeen";

export function MobileExperienceNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* sessionStorage bisa dilempar di mode privat — anggap belum pernah lihat */
    }
    if (isDesktop && !alreadySeen) setOpen(true);
  }, []);

  function dismiss() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* abaikan bila storage tak tersedia — cukup tutup popup */
    }
    setOpen(false);
  }

  return (
    <Modal open={open} onClose={dismiss}>
      <div className="flex flex-col items-center text-center gap-4">
        <span className="w-20 h-20 rounded-full bg-primary text-white border-3 border-ink shadow-solid-md flex items-center justify-center animate-bounce-in">
          <span
            className="material-symbols-rounded"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: 40 }}
          >
            smartphone
          </span>
        </span>
        <h3 className="font-display text-title text-ink">Lebih asyik di HP!</h3>
        <p className="font-body text-body text-ink-soft">
          KopQuest dirancang buat pengalaman{" "}
          <span className="font-semibold text-ink">mobile</span>. Biar tampilannya pas,
          buka lewat HP kamu ya. Versi desktop masih dalam pengembangan 
        </p>
        <PushButton onClick={dismiss} className="w-full mt-1">
          Oke, mengerti!
        </PushButton>
      </div>
    </Modal>
  );
}
