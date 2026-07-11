import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PushButton } from "@/components/ui/PushButton";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RoleCard, type RoleColor } from "@/components/game/RoleCard";

type Role = {
  icon: string;
  mascot: string;
  name: string;
  description: string;
  badge?: string;
  color: RoleColor;
};

const ROLES: Role[] = [
  {
    icon: "storefront",
    mascot: "/mascot-affiliator.png",
    name: "Affiliator",
    description: "Jual produk koperasi dan dapat komisi dari setiap penjualan",
    badge: "Paling populer",
    color: "primary",
  },
  {
    icon: "photo_camera",
    mascot: "/mascot-content-creator.png",
    name: "Content Creator",
    description: "Bikin konten promosi yang menarik untuk produk koperasi",
    color: "secondary",
  },
  {
    icon: "diversity_3",
    mascot: "/mascot-duta-sebaya.jpg",
    name: "Duta Sebaya",
    description: "Ajak warga bergabung dan kenalkan koperasi ke lingkungan sekitar",
    color: "tertiary",
  },
];

const STEPS = [
  { title: "Gabung", description: "Daftar dan pilih koperasimu" },
  {
    title: "Pilih Role",
    description: "Jadi Affiliator, Content Creator, atau Duta Sebaya",
  },
  { title: "Kerjakan Misi", description: "AI memberi misi sesuai levelmu" },
  {
    title: "Naik Level, Dapat Hadiah",
    description: "Kumpulkan XP dan tukar dengan hadiah nyata",
  },
];

const REWARDS = [
  "Rp10.000 Shopping Voucher",
  "Free Shipping Voucher",
  "15% Discount Voucher",
];

export default function Home() {
  return (
    <div className="bg-surface text-ink font-body text-body min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-grow pt-16 pb-24 max-w-app mx-auto w-full px-md">
        {/* 1. Hero — "Mission Board": semua visual dari CSS/HTML, tanpa gambar maskot */}
        <section className="relative pt-12 pb-14 overflow-hidden">
          <div
            className="absolute inset-0 -z-10 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="flex flex-col items-center text-center gap-5 px-1">
            <h2 className="font-display text-display text-balance max-w-[32rem]">
              Gimana kalau jualan produk desa bisa bikin kamu naik level?
            </h2>
            <p className="font-body text-body text-ink-soft max-w-[28rem]">
              Di KopQuest, kontribusimu ke koperasi jadi XP, reward, dan reputasi nyata.
            </p>
            <PushButton href="/register" size="lg" className="mt-1">
              Ayo mulai game pertamamu
            </PushButton>
          </div>

          {/* Mission board: kartu misi bertumpuk + XP badge melayang */}
          <div className="relative mt-10 h-[230px] flex items-center justify-center">
            {/* kartu belakang — dekoratif, redup */}
            <Card
              variant="hero"
              className="absolute w-40 !p-3 rotate-[-9deg] -translate-x-3 opacity-45 z-0 text-left"
            >
              <span className="w-7 h-7 rounded-full bg-tertiary text-white border-2 border-ink flex items-center justify-center">
                <span className="material-symbols-rounded" style={{ fontSize: 14 }}>
                  diversity_3
                </span>
              </span>
              <p className="font-display text-caption text-ink mt-2">Duta Sebaya</p>
            </Card>

            {/* kartu tengah — dekoratif, agak redup */}
            <Card
              variant="hero"
              className="absolute w-44 !p-3 rotate-[7deg] translate-x-3 opacity-70 z-10 text-left"
            >
              <span className="w-7 h-7 rounded-full bg-secondary text-white border-2 border-ink flex items-center justify-center">
                <span className="material-symbols-rounded" style={{ fontSize: 14 }}>
                  photo_camera
                </span>
              </span>
              <p className="font-display text-caption text-ink mt-2">Content Creator</p>
            </Card>

            {/* kartu depan — misi utama, melayang pelan */}
            <div className="relative z-20 animate-float">
              <Card
                variant="hero"
                className="w-60 !p-4 rotate-[-2deg] text-left flex flex-col gap-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-primary text-white border-2 border-ink flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
                      storefront
                    </span>
                  </span>
                  <span className="font-display text-body-strong text-ink">Affiliator</span>
                </div>
                <p className="font-body text-caption text-ink-soft leading-snug">
                  &quot;Jual 10 produk koperasi&quot;
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Chip variant="earth">Rp200rb</Chip>
                  <Chip variant="success">+30 XP</Chip>
                </div>
                <div>
                  <ProgressBar percent={70} className="h-2.5" />
                  <p className="font-body text-caption text-ink-soft mt-1">3 hari lagi</p>
                </div>
              </Card>
            </div>

            {/* XP badge melayang */}
            <div className="absolute -top-2 right-3 z-30 rotate-[6deg]">
              <div className="animate-float bg-secondary text-white border-2.5 border-ink rounded-chip shadow-solid-sm px-3 py-1.5">
                <span className="font-display text-label font-extrabold whitespace-nowrap">
                  +50 XP! ✨
                </span>
              </div>
            </div>
          </div>

          {/* progress bar hero */}
          <div className="max-w-[18rem] mx-auto mt-6 px-1">
            <p className="text-center font-body text-caption font-semibold text-ink-soft mb-1.5">
              Level 1 → Level 2
            </p>
            <ProgressBar percent={65} />
          </div>
        </section>

        {/* 2. Pilih Role-mu */}
        <section className="py-10">
          <h3 className="font-display text-title text-center mb-6">Pilih Role-mu</h3>
          <div className="grid gap-4">
            {ROLES.map((role) => (
              <RoleCard
                key={role.name}
                color={role.color}
                badge={role.badge}
                name={role.name}
                description={role.description}
                bareIcon
                icon={
                  <img
                    src={role.mascot}
                    alt={`Maskot ${role.name}`}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                }
              />
            ))}
          </div>
        </section>

        {/* 3. Cara Kerjanya */}
        <section className="py-10">
          <h3 className="font-display text-title text-center mb-8">Cara Kerjanya</h3>
          <div className="flex flex-col gap-5 max-w-[28rem] mx-auto">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex items-start gap-4">
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-full text-white border-2.5 border-ink flex items-center justify-center font-display text-body-strong ${
                    i % 2 === 0
                      ? "bg-primary shadow-press-primary"
                      : "bg-secondary shadow-press-secondary"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-display text-title-sm text-ink">{step.title}</h4>
                  <p className="font-body text-body text-ink-soft">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. AI Mission Assistant */}
        <section className="py-10">
          <Card className="flex flex-col items-center text-center gap-3">
            <span className="w-16 h-16 rounded-full bg-primary text-white border-2.5 border-ink shadow-press-primary flex items-center justify-center">
              <span className="material-symbols-rounded" style={{ fontSize: 32 }}>
                auto_awesome
              </span>
            </span>
            <h3 className="font-display text-title text-ink">AI Mission Assistant</h3>
            <p className="font-body text-body text-ink-soft max-w-[24rem]">
              Bingung mulai dari mana? AI Assistant bisa menyarankan misi yang
              cocok untukmu, bahkan membantu membuat caption promosi produk.
            </p>
          </Card>
        </section>

        {/* 5. Progress & Reward preview */}
        <section className="py-10">
          <Card className="flex flex-col items-center text-center gap-3">
            <span className="w-16 h-16 rounded-full bg-secondary text-white border-2.5 border-ink shadow-press-secondary flex items-center justify-center">
              <span className="material-symbols-rounded" style={{ fontSize: 32 }}>
                award_star
              </span>
            </span>
            <h3 className="font-display text-title text-ink">Progresmu, Hadiah Nyata</h3>
            <div className="w-full flex items-center justify-between gap-3">
              <Chip variant="level">Level 3</Chip>
              <span className="font-display text-stat text-secondary-dark">+50 XP</span>
            </div>
            <ProgressBar percent={65} />
            <div className="flex flex-wrap justify-center gap-2">
              {REWARDS.map((r) => (
                <Chip key={r} variant="success">
                  {r}
                </Chip>
              ))}
            </div>
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
