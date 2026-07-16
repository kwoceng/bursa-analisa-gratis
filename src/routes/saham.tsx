import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { MarketSummary } from "@/components/market/MarketSummary";
import { StockTable } from "@/components/market/StockTable";
import { sectors, stocks } from "@/data/stocks";

export const Route = createFileRoute("/saham")({
  head: () => ({
    meta: [
      { title: "Daftar Saham IDX — BursaKita" },
      {
        name: "description",
        content:
          "Jelajahi harga, volume, dan kapitalisasi pasar saham-saham utama Bursa Efek Indonesia dalam satu tabel yang mudah disortir.",
      },
      { property: "og:title", content: "Daftar Saham IDX — BursaKita" },
      {
        property: "og:description",
        content: "Tabel harga saham IDX yang bisa disortir dan difilter berdasarkan sektor.",
      },
    ],
  }),
  component: SahamPage,
});

function SahamPage() {
  const [q, setQ] = useState("");
  const [sektor, setSektor] = useState<string>("Semua");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return stocks.filter((s) => {
      const matchQ =
        !query || s.kode.toLowerCase().includes(query) || s.nama.toLowerCase().includes(query);
      const matchS = sektor === "Semua" || s.sektor === sektor;
      return matchQ && matchS;
    });
  }, [q, sektor]);

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Pasar</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Daftar saham Bursa Efek Indonesia
          </h1>
          <p className="mt-3 text-muted-foreground">
            Cari berdasarkan kode atau nama, dan filter berdasarkan sektor untuk melihat
            performa terbaru.
          </p>
        </div>

        <div className="mt-8">
          <MarketSummary />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari kode saham atau nama emiten…"
              className="w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <SectorChip label="Semua" active={sektor === "Semua"} onClick={() => setSektor("Semua")} />
            {sectors.map((s) => (
              <SectorChip key={s} label={s} active={sektor === s} onClick={() => setSektor(s)} />
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Menampilkan <span className="font-medium text-foreground">{filtered.length}</span>{" "}
          dari {stocks.length} saham
        </p>

        <div className="mt-3">
          <StockTable data={filtered} />
        </div>
      </div>
    </SiteShell>
  );
}

function SectorChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}