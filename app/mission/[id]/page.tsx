import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/Card";
import { PushButton } from "@/components/ui/PushButton";

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="bg-surface text-ink font-body text-body min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-grow pt-16 pb-24 max-w-app mx-auto w-full px-md flex items-center justify-center">
        <Card className="text-center flex flex-col items-center gap-3">
          <span className="w-16 h-16 rounded-full bg-primary text-white border-2.5 border-ink shadow-solid-md flex items-center justify-center">
            <span className="material-symbols-rounded" style={{ fontSize: 32 }}>
              construction
            </span>
          </span>
          <h2 className="font-display text-title text-ink">Detail misi segera hadir</h2>
          <p className="font-body text-body text-ink-soft">
            Halaman detail untuk misi #{id} masih kami siapkan. Progresmu tetap
            aman dan bisa dipantau lewat berandamu.
          </p>
          <PushButton href="/home" className="w-full mt-1">
            Kembali ke Beranda
          </PushButton>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
