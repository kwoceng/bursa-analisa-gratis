import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { news } from "@/data/news";
import { formatTanggal } from "@/lib/format";
import { useLiveNews } from "@/hooks/use-live-news";
import type { FeedNewsItem } from "@/lib/news.functions";

const categories = ["Semua", "Pasar", "Emiten", "Makro", "Global"] as const;

export const Route = createFileRoute("/berita")({
  head: () => ({
    meta: [
      { title: "Berita Pasar Saham Indonesia — BursaKita" },
      {
        name: "description",
        content:
          "Berita pasar saham Indonesia real-time dari CNBC Indonesia, Kontan, detikFinance, dan IDX Channel.",
      },
      { property: "og:title", content: "Berita Pasar — BursaKita" },
      {
        property: "og:description",
        content: "Berita emiten, kebijakan makro, dan sentimen global yang menggerakkan IHSG.",
      },
    ],
  }),
  component: BeritaPage,
});

function BeritaPage() {
  const { data, isLoading, isError } = useLiveNews();
  const liveItems = data?.items ?? [];
  const hasLive = liveItems.length > 0;

  return hasLive ? (
    <LiveBerita items={liveItems} />
  ) : (
    <DemoBerita loading={isLoading} failed={isError || Boolean(data?.error)} />
  );
}

function LiveBerita({ items }: { items: FeedNewsItem[] }) {
  const sumbers = useMemo(
    () => ["Semua", ...Array.from(new Set(items.map((i) => i.sumber)))],
    [items],
  );
  const [sumber, setSumber] = useState("Semua");
  const filtered = useMemo(
    () => (sumber === "Semua" ? items : items.filter((i) => i.sumber === sumber)),
    [items, sumber],
  );

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Newsroom</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-up-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-up">
            <span className="h-1.5 w-1.5 rounded-full bg-up animate-pulse" />
            LIVE
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Berita pasar saham Indonesia
        </h1>
        <p className="mt-3 text-muted-foreground">
          Diambil otomatis dari RSS media finansial Indonesia, diperbarui setiap beberapa menit.
          Klik judul untuk membaca artikel lengkap di situs sumber.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {sumbers.map((s) => (
            <button
              key={s}
              onClick={() => setSumber(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                sumber === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {filtered.map((n) => (
            <a
              key={n.id}
              href={n.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                  {n.sumber}
                </span>
                <span className="text-muted-foreground">{formatTanggal(n.tanggal)}</span>
              </div>
              <h2 className="mt-3 flex items-start gap-1.5 font-display text-xl font-semibold leading-snug text-foreground group-hover:text-primary">
                {n.judul}
                <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.ringkasan}</p>
              {n.terkait && n.terkait.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Saham terkait:</span>
                  {n.terkait.map((k) => (
                    <span
                      key={k}
                      className="rounded bg-accent px-2 py-0.5 font-mono font-medium text-accent-foreground"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Tidak ada berita untuk sumber ini.
            </p>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function DemoBerita({ loading, failed }: { loading: boolean; failed: boolean }) {
  const [kat, setKat] = useState<(typeof categories)[number]>("Semua");
  const filtered = useMemo(
    () => (kat === "Semua" ? news : news.filter((n) => n.kategori === kat)),
    [kat],
  );

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Newsroom</p>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {loading ? "Memuat…" : "Demo"}
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Berita pasar saham Indonesia
        </h1>
        <p className="mt-3 text-muted-foreground">
          {failed
            ? "Gagal mengambil berita live dari sumber RSS — menampilkan kurasi berita demo."
            : "Memuat berita live…"}{" "}
          Kurasi berita terkait pergerakan IHSG, aksi korporasi, dan katalis makro terbaru.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setKat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                kat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-6">
          {filtered.map((n) => (
            <article
              key={n.id}
              id={n.id}
              className="scroll-mt-24 rounded-xl border border-border/60 bg-card p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                  {n.kategori}
                </span>
                <span className="text-muted-foreground">{formatTanggal(n.tanggal)}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{n.sumber}</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-foreground">
                {n.judul}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.ringkasan}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{n.isi}</p>
              {n.terkait && n.terkait.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Saham terkait:</span>
                  {n.terkait.map((k) => (
                    <a
                      key={k}
                      href={`/saham/${k}`}
                      className="rounded bg-accent px-2 py-0.5 font-mono font-medium text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      {k}
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
