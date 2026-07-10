export function daysRemaining(deadlineDate: string): number {
  const deadline = new Date(deadlineDate + "T23:59:59");
  const diffMs = deadline.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function formatRupiah(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);
}

// Tanggal ringkas gaya Indonesia, mis. "10 Jul 2026". Aman untuk string ISO
// dari backend (created_at/completed_at); balikin "" kalau tak valid.
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
