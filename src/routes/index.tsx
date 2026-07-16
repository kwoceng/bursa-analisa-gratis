import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LineChart, Newspaper, Star } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { MarketSummary } from "@/components/market/MarketSummary";
import { StockTable } from "@/components/market/StockTable";
import { NewsCard } from "@/components/news/NewsCard";
import { topGainers, topLosers, topVolume } from "@/data/stocks";
import { news } from "@/data/news";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const gainers = topGainers(5);
  const losers = topLosers(5);
  const active = topVolume(5);
  const latestNews = news.slice(0, 3);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-accent/40 to-background">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_0%,color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent_55%),radial-gradient(circle_at_90%_20%,color-mix(in_oklab,var(--color-up)_14%,transparent),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-up animate-pulse" />
                Data pasar diperbarui setiap sesi
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Analisa Bursa Saham Indonesia,{" "}
                <span className="text-primary">gratis untuk semua.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Pantau pergerakan IHSG, harga saham unggulan, dan berita pasar dalam satu
                tampilan yang bersih. Simpan saham favorit ke watchlist pribadi tanpa perlu
                mendaftar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/saham"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  Jelajahi daftar saham
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/berita"
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Baca berita pasar
                </Link>
              </div>
            </div>

            <div className="mt-12">
              <MarketSummary />
            </div>
          </div>
      </section>

      {/* Movers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <MoverBlock title="Top Gainers" tone="up" stocks={gainers} />
          <MoverBlock title="Top Losers" tone="down" stocks={losers} />
          <MoverBlock title="Paling Aktif" tone="neutral" stocks={active} />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<LineChart className="h-5 w-5" />}
            title="Data pasar terkurasi"
            body="Harga penutupan, volume, kapitalisasi pasar, PER dan PBV untuk saham-saham unggulan BEI."
          />
          <FeatureCard
            icon={<Star className="h-5 w-5" />}
            title="Watchlist tanpa login"
            body="Simpan saham favorit langsung di peramban Anda. Tidak perlu daftar, tidak ada email."
          />
          <FeatureCard
            icon={<Newspaper className="h-5 w-5" />}
            title="Berita pasar harian"
            body="Ringkasan berita emiten, kebijakan makro, dan sentimen global yang menggerakkan IHSG."
          />
        </div>
      </section>

      {/* Latest news */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Berita pasar terbaru
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sentimen dan katalis yang perlu Anda ketahui.
            </p>
          </div>
          <Link
            to="/berita"
            className="hidden text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            Lihat semua →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {latestNews.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function MoverBlock({
  title,
  tone,
  stocks,
}: {
  title: string;
  tone: "up" | "down" | "neutral";
  stocks: import("@/data/stocks").Stock[];
}) {
  const dot =
    tone === "up"
      ? "bg-up"
      : tone === "down"
        ? "bg-down"
        : "bg-primary";
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <StockTable data={stocks} compact />
    </div>
  );
}
