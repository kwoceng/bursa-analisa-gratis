import { Star } from "lucide-react";
import { useWatchlist } from "@/hooks/use-watchlist";

export function WatchlistButton({ kode }: { kode: string }) {
  const { has, toggle, hydrated } = useWatchlist();
  const active = hydrated && has(kode);
  return (
    <button
      type="button"
      onClick={() => toggle(kode)}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background text-foreground hover:bg-accent"
      }`}
    >
      <Star className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
      {active ? "Ada di Watchlist" : "Tambah ke Watchlist"}
    </button>
  );
}
