import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw } from "lucide-react";
import { marketIndices } from "@/data/stocks";
import { getLiveIndices, type LiveQuote } from "@/lib/quotes.functions";
import { PriceChange } from "./PriceChange";

const numberFmt = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function MarketSummary() {
  const fetchLive = useServerFn(getLiveIndices);
  const { data, isFetching, isError, dataUpdatedAt, refetch } = useQuery({
    queryKey: ["live-indices"],
    queryFn: () => fetchLive(),
    refetchInterval: 30_000, // segarkan tiap 30 detik
    refetchOnWindowFocus: true,
    staleTime: 15_000,
  });

  const liveByLabel = new Map<string, LiveQuote>();
  data?.quotes.forEach((q) => liveByLabel.set(q.label, q));
  const liveIhsg = liveByLabel.get("IHSG");
  const hasError = isError || Boolean(data?.error);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${liveIhsg ? "bg-up animate-pulse" : hasError ? "bg-down" : "bg-muted-foreground"}`}
          />
          <span>
            {liveIhsg
              ? `IHSG live · pembaruan terakhir ${formatClock(dataUpdatedAt)}`
              : hasError
                ? "Gagal mengambil harga live — menampilkan data demo"
                : "Memuat harga live IHSG…"}
          </span>
          {liveIhsg?.marketState && liveIhsg.marketState !== "REGULAR" && (
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium uppercase tracking-wider">
              {liveIhsg.marketState}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-accent hover:text-foreground"
          aria-label="Segarkan harga"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Segarkan
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {marketIndices.map((idx) => {
          const live = liveByLabel.get(idx.nama);
          const nilai = live?.price ?? idx.nilai;
          const perubahan = live?.change ?? idx.perubahan;
          const perubahanPersen = live?.changePercent ?? idx.perubahanPersen;
          const isLive = Boolean(live);
          return (
            <div
              key={idx.nama}
              className={`rounded-xl border bg-card p-4 shadow-sm transition-colors ${
                isLive ? "border-primary/40 ring-1 ring-primary/10" : "border-border/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {idx.nama}
                </div>
                {isLive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-up-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-up">
                    <span className="h-1.5 w-1.5 rounded-full bg-up animate-pulse" />
                    LIVE
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Demo
                  </span>
                )}
              </div>
              <div className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground">
                {numberFmt.format(nilai)}
              </div>
              <div className="mt-2">
                <PriceChange value={perubahan} percent={perubahanPersen} size="sm" />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Sumber IHSG: Yahoo Finance (<code>^JKSE</code>), diperbarui otomatis tiap 30 detik. LQ45,
        IDX30, dan IDXBUMN20 masih data demo karena tidak tersedia sebagai simbol gratis di Yahoo
        Finance.
      </p>
    </div>
  );
}
