import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { PriceChange } from "@/components/market/PriceChange";
import { StockChart } from "@/components/stock/StockChart";
import { WatchlistButton } from "@/components/stock/WatchlistButton";
import { generateHistory, getStock } from "@/data/stocks";
import { getStockHistory } from "@/lib/quotes.functions";
import { useLiveStockQuotes, mergeLiveStock } from "@/hooks/use-live-quotes";
import { formatMarketCap, formatRupiah, formatVolume } from "@/lib/format";

export const Route = createFileRoute("/saham_/$kode")({
  loader: ({ params }) => {
    const stock = getStock(params.kode);
    if (!stock) throw notFound();
    return {
      stock,
      history: generateHistory(stock.kode, 30),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Saham tidak ditemukan — BursaKita" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const s = loaderData.stock;
    const title = `${s.kode} — ${s.nama} | BursaKita`;
    const desc = `Harga, statistik, dan pergerakan saham ${s.kode} (${s.nama}) di Bursa Efek Indonesia.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: NotFoundStock,
  errorComponent: ({ error }) => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Gagal memuat saham</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
    </SiteShell>
  ),
  component: StockDetail,
});

function NotFoundStock() {
  const { kode } = Route.useParams();
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">404</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground">
          Saham "{kode}" tidak ditemukan
        </h1>
        <p className="mt-3 text-muted-foreground">
          Kode saham yang Anda cari belum tersedia di data demo kami.
        </p>
        <Link
          to="/saham"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke daftar saham
        </Link>
      </div>
    </SiteShell>
  );
}

function StockDetail() {
  const { stock: baseStock, history: demoHistory } = Route.useLoaderData();
  const { byKode: liveByKode } = useLiveStockQuotes();
  const stock = mergeLiveStock(baseStock, liveByKode.get(baseStock.kode));

  const fetchHistory = useServerFn(getStockHistory);
  const { data: historyData } = useQuery({
    queryKey: ["stock-history", stock.kode],
    queryFn: () => fetchHistory({ data: stock.kode }),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
  const liveHistory = historyData?.points ?? [];
  const isHistoryLive = liveHistory.length > 0;
  const history = isHistoryLive ? liveHistory : demoHistory;
  const positive = stock.perubahanPersen >= 0;

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/saham"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Semua saham
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
                {stock.kode}
              </h1>
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                {stock.sektor}
              </span>
              {stock.isLive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-up-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-up">
                  <span className="h-1.5 w-1.5 rounded-full bg-up animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <p className="mt-1 text-lg text-muted-foreground">{stock.nama}</p>
          </div>
          <WatchlistButton kode={stock.kode} />
        </div>

        <div className="mt-8 flex flex-wrap items-baseline gap-4">
          <div className="font-display text-5xl font-bold tabular-nums text-foreground">
            Rp {formatRupiah(stock.harga)}
          </div>
          <PriceChange value={stock.perubahan} percent={stock.perubahanPersen} size="lg" />
        </div>

        <div className="mt-8 rounded-xl border border-border/60 bg-card p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-foreground">
              Pergerakan {isHistoryLive ? "3 bulan" : "30 hari"}
            </h2>
            <span className="text-xs text-muted-foreground">
              Harga penutupan harian ({isHistoryLive ? "Yahoo Finance" : "demo"})
            </span>
          </div>
          <StockChart data={history} positive={positive} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Tertinggi 52 mgg" value={"Rp " + formatRupiah(stock.high52)} />
          <Stat label="Terendah 52 mgg" value={"Rp " + formatRupiah(stock.low52)} />
          <Stat label="Volume" value={formatVolume(stock.volume) + " lot"} />
          <Stat label="Kapitalisasi Pasar" value={"Rp " + formatMarketCap(stock.marketCap)} />
          <Stat label="PER" value={stock.per === 0 ? "—" : stock.per.toFixed(1) + "x"} />
          <Stat label="PBV" value={stock.pbv.toFixed(2) + "x"} />
          <Stat
            label="Dividend Yield"
            value={stock.dividendYield === 0 ? "—" : stock.dividendYield.toFixed(1) + "%"}
          />
          <Stat label="Sektor" value={stock.sektor} />
        </div>

        <div className="mt-8 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="font-display text-base font-semibold text-foreground">Tentang Emiten</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stock.deskripsi}</p>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Data ditampilkan untuk kebutuhan edukasi dan tidak mencerminkan harga perdagangan aktual.
          Bukan rekomendasi investasi.
        </p>
      </div>
    </SiteShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1.5 font-display text-lg font-semibold tabular-nums text-foreground">
        {value}
      </div>
    </div>
  );
}
