"use client";

import { useState } from "react";
import { PushButton } from "@/components/ui/PushButton";
import { Card } from "@/components/ui/Card";
import { Chip, StickerTag } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { FieldInput } from "@/components/ui/FieldInput";
import { SelectField } from "@/components/ui/SelectField";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal, BottomSheet } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { LevelBadge } from "@/components/game/LevelBadge";
import { StatTile } from "@/components/game/StatTile";
import { MissionCard } from "@/components/game/MissionCard";
import { RoleCard } from "@/components/game/RoleCard";
import { BattlePassNode } from "@/components/game/BattlePassNode";
import { StepTracker } from "@/components/game/StepTracker";
import { CelebrationOverlay } from "@/components/game/CelebrationOverlay";

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="py-8 border-t-2 border-border-soft first:border-t-0 first:pt-0">
      <h2 className="font-display text-title text-ink flex items-center gap-2 mb-4">
        <span className="material-symbols-rounded">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<number | "">("");
  const [celebrate, setCelebrate] = useState(false);

  return (
    <div className="bg-surface text-ink font-body text-body min-h-screen">
      <main className="max-w-app mx-auto w-full px-md py-8">
        <h1 className="font-display text-display text-ink">Design System</h1>
        <p className="font-body text-body text-ink-soft mt-1">
          KopQuest — chunky, tactile, board-game feel.
        </p>

        <Section title="Pushable Buttons" icon="smart_button">
          <p className="font-body text-caption text-neutral mb-3">
            Tekan tombolnya — terasa turun seperti tombol fisik.
          </p>
          <div className="flex flex-wrap gap-3 mb-3">
            <PushButton variant="primary">Find Mission</PushButton>
            <PushButton variant="secondary" icon={<span className="material-symbols-rounded" style={{ fontSize: 20 }}>check_circle</span>}>
              Verify
            </PushButton>
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            <PushButton variant="tertiary">Pilih Role</PushButton>
            <PushButton variant="ghost">Kembali</PushButton>
            <PushButton variant="primary" disabled>
              Terkunci
            </PushButton>
          </div>
          <div className="flex flex-wrap gap-3">
            <PushButton variant="primary" size="sm">
              Small
            </PushButton>
            <PushButton variant="primary" size="md">
              Medium
            </PushButton>
            <PushButton variant="primary" size="lg">
              Large
            </PushButton>
            <PushButton variant="primary" loading>
              Loading
            </PushButton>
          </div>
        </Section>

        <Section title="Level, XP & Chips" icon="badge">
          <div className="flex items-center gap-4">
            <LevelBadge level={5} />
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <Chip variant="level">Lv 5</Chip>
                <Chip variant="success" icon={<span className="material-symbols-rounded" style={{ fontSize: 14 }}>check</span>}>
                  Completed
                </Chip>
                <Chip variant="danger">Failed</Chip>
              </div>
              <div className="flex flex-wrap gap-2">
                <Chip variant="warning">Deadline 2 hari!</Chip>
                <Chip variant="earth">Affiliator</Chip>
              </div>
            </div>
          </div>
          <div className="relative inline-block bg-surface-card border-2.5 border-ink rounded-card shadow-solid-sm px-6 py-4 mt-4">
            <StickerTag>BARU!</StickerTag>
            <span className="font-body text-caption text-ink-soft">Sticker tag di pojok kartu</span>
          </div>
        </Section>

        <Section title="Progress Bar" icon="battery_charging_full">
          <Card>
            <div className="flex justify-between font-body text-label font-semibold mb-2">
              <span>Level 4</span>
              <span className="font-display text-ink text-secondary-dark">+50 XP</span>
            </div>
            <ProgressBar percent={68} />
            <p className="font-body text-caption text-neutral mt-2">
              Tebal, dengan stripe &quot;energi&quot; yang bergerak.
            </p>
          </Card>
        </Section>

        <Section title="Account Summary Tiles" icon="dashboard">
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              label="Total XP"
              value="1.240"
              icon={<span className="material-symbols-rounded" style={{ fontSize: 15 }}>bolt</span>}
            />
            <StatTile
              label="Task Selesai"
              value="28"
              icon={<span className="material-symbols-rounded" style={{ fontSize: 15 }}>task_alt</span>}
            />
          </div>
        </Section>

        <Section title="Mission Card" icon="explore">
          <MissionCard
            title="Affiliator Mission"
            role="Affiliator"
            level={3}
            deadlineLabel="2 hari"
            objective="Jual produk dengan total GMV minimal Rp200.000 sebelum deadline."
            percent={45}
            isNew
            tags={[
              { label: "Target Rp200rb", variant: "earth" },
              { label: "6 pcs", variant: "primary-soft" },
              { label: "+30 XP", variant: "success" },
            ]}
          />
        </Section>

        <Section title="Role Cards" icon="diversity_3">
          <div className="grid gap-4">
            <RoleCard
              color="primary"
              badge="Paling populer"
              name="Affiliator"
              description="Jual produk koperasi dan dapat komisi dari setiap penjualan"
              icon={<span className="material-symbols-rounded">storefront</span>}
            />
            <RoleCard
              color="secondary"
              name="Content Creator"
              description="Bikin konten promosi yang menarik untuk produk koperasi"
              icon={<span className="material-symbols-rounded">photo_camera</span>}
            />
          </div>
        </Section>

        <Section title="Battle Pass" icon="military_tech">
          <Card>
            <div className="flex justify-between items-center">
              <BattlePassNode tier={1} state="claimed" />
              <div className="flex-1 h-[3px] bg-secondary mx-1" />
              <BattlePassNode tier={2} state="unlocked" icon={2} />
              <div className="flex-1 h-[3px] bg-border-soft mx-1" />
              <BattlePassNode tier={3} state="locked" />
            </div>
          </Card>
        </Section>

        <Section title="Form & Step Tracker" icon="edit_note">
          <Card className="flex flex-col gap-4">
            <StepTracker current={2} />
            <FieldInput label="Username" value="budi_desa" valid readOnly />
            <SelectField
              label="Contoh Select"
              value={selectValue}
              onChange={setSelectValue}
              placeholder="Pilih opsi"
              options={[
                { value: 1, label: "Opsi Pertama" },
                { value: 2, label: "Opsi Kedua" },
              ]}
            />
          </Card>
        </Section>

        <Section title="Celebration" icon="celebration">
          {celebrate ? (
            <CelebrationOverlay
              icon={
                <span className="material-symbols-rounded" style={{ fontSize: 40 }}>
                  military_tech
                </span>
              }
              title="Mantap! Kamu naik Level 6"
              subtitle="Teruskan misimu buat XP lebih banyak."
              xp={50}
              bonusXp={25}
              bonusLabel="bonus referral!"
            >
              <PushButton variant="ghost" className="w-full mt-4" onClick={() => setCelebrate(false)}>
                Tutup
              </PushButton>
            </CelebrationOverlay>
          ) : (
            <PushButton variant="secondary" onClick={() => setCelebrate(true)}>
              Putar ulang celebration
            </PushButton>
          )}
        </Section>

        <Section title="Empty State" icon="volunteer_activism">
          <EmptyState
            icon={<span className="material-symbols-rounded">volunteer_activism</span>}
            title="Belum ada misi nih"
            description="Yuk mulai misi pertamamu buat dapetin XP!"
          />
        </Section>

        <Section title="Avatar" icon="account_circle">
          <div className="flex items-center gap-3">
            <Avatar name="Budi Santoso" size={48} />
            <Avatar name="Siti Aminah" size={64} />
          </div>
        </Section>

        <Section title="Toast" icon="chat">
          <div className="flex flex-wrap gap-3">
            <PushButton variant="secondary" onClick={() => showToast("+30 XP! Misi selesai.", "success")}>
              Trigger Success
            </PushButton>
            <PushButton variant="primary" onClick={() => showToast("Sesi berakhir, silakan masuk lagi.", "danger")}>
              Trigger Error
            </PushButton>
          </div>
        </Section>

        <Section title="Modal & Bottom Sheet" icon="dock_to_bottom">
          <div className="flex flex-wrap gap-3">
            <PushButton variant="ghost" onClick={() => setModalOpen(true)}>
              Buka Modal
            </PushButton>
            <PushButton variant="ghost" onClick={() => setSheetOpen(true)}>
              Buka Bottom Sheet
            </PushButton>
          </div>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Konfirmasi Misi">
            <p className="font-body text-body text-ink-soft mb-4">
              Yakin mau tandai misi ini selesai?
            </p>
            <PushButton className="w-full" onClick={() => setModalOpen(false)}>
              Ya, Selesai
            </PushButton>
          </Modal>
          <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Detail Misi">
            <p className="font-body text-body text-ink-soft mb-4">
              Jual produk koperasi dengan total GMV minimal Rp200.000 sebelum
              deadline berakhir.
            </p>
            <PushButton className="w-full" onClick={() => setSheetOpen(false)}>
              Tutup
            </PushButton>
          </BottomSheet>
        </Section>
      </main>
    </div>
  );
}
