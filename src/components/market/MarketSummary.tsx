import { marketIndices } from "@/data/stocks";
import { PriceChange } from "./PriceChange";

export function MarketSummary() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {marketIndices.map((idx) => (
        <div
          key={idx.nama}
          className="rounded-xl border border-border/60 bg-card p-4 shadow-sm"
        >
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {idx.nama}
          </div>
          <div className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground">
            {new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(idx.nilai)}
          </div>
          <div className="mt-2">
            <PriceChange value={idx.perubahan} percent={idx.perubahanPersen} size="sm" />
          </div>
        </div>
      ))}
    </div>
  );
}