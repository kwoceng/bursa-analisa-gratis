export function formatRupiah(v: number): string {
  return new Intl.NumberFormat("id-ID").format(Math.round(v));
}

export function formatVolume(v: number): string {
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2) + " M";
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(2) + " Jt";
  if (v >= 1_000) return (v / 1_000).toFixed(1) + " rb";
  return v.toString();
}

export function formatMarketCap(miliar: number): string {
  if (miliar >= 1_000) return (miliar / 1_000).toFixed(2) + " T";
  return miliar.toFixed(0) + " M";
}

export function formatTanggal(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}