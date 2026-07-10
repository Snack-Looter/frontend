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
        {/* 1. Hero */}
        <section className="pt-12 pb-14 flex flex-col items-center text-center gap-5">
          <div className="flex items-end justify-center">
            <img
              src="/mascot-content-creator.png"
              alt="Maskot Content Creator"
              className="w-16 h-16 -mr-3 rotate-[-8deg] rounded-full border-2.5 border-ink object-cover shadow-solid-sm"
            />
            <img
              src="/mascot-affiliator.png"
              alt="Maskot Affiliator KopQuest"
              className="w-24 h-24 rounded-full border-2.5 border-ink object-cover shadow-solid-sm z-10"
            />
            <img
              src="/mascot-duta-sebaya.jpg"
              alt="Maskot Duta Sebaya"
              className="w-16 h-16 -ml-3 rotate-[8deg] rounded-full border-2.5 border-ink object-cover shadow-solid-sm"
            />
          </div>
          <h2 className="font-display text-display text-balance max-w-[32rem]">
            Bantu koperasimu, naik level, dapat cuan nyata.
          </h2>
          <p className="font-body text-body text-ink-soft max-w-[28rem]">
            Kerjakan misi nyata di koperasi desamu: jualan produk, bikin
            konten promosi, atau ajak warga bergabung. Setiap misi yang
            selesai menambah XP, menaikkan level, dan mendekatkanmu ke hadiah
            asli.
          </p>
          <PushButton href="/chatbot" size="lg" className="mt-2">
            Mulai misi pertamamu
          </PushButton>
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
                icon={
                  <img
                    src={role.mascot}
                    alt={`Maskot ${role.name}`}
                    className="w-full h-full rounded-full object-cover"
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
          <h3 className="font-display text-title text-center mb-6">Progresmu, Hadiah Nyata</h3>
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Chip variant="level">Level 3</Chip>
              <span className="font-display text-stat text-secondary-dark">+50 XP</span>
            </div>
            <ProgressBar percent={65} />
            <div className="flex flex-wrap gap-2">
              {REWARDS.map((r) => (
                <Chip key={r} variant="success">
                  {r}
                </Chip>
              ))}
            </div>
          </Card>
        </section>

        {/* 6. Closing CTA */}
        <section className="py-14 text-center">
          <PushButton href="/chatbot" size="lg">
            Mulai misi pertamamu
          </PushButton>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
