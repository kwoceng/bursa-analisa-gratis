import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { news } from "@/data/news";
import { formatTanggal } from "@/lib/format";

const categories = ["Semua", "Pasar", "Emiten", "Makro", "Global"] as const;

export const Route = createFileRoute("/berita")({
  head: () => ({
    meta: [
      { title: "Berita Pasar Saham Indonesia — BursaKita" },
      {
        name: "description",
        content:
          "Ringkasan berita emiten, kebijakan makro, dan sentimen global yang menggerakkan Bursa Efek Indonesia.",
      },
      { property: "og:title", content: "Berita Pasar — BursaKita" },
      {
        property: "og:description",
        content: "Ringkasan berita emiten dan pasar yang menggerakkan IHSG.",
      },
    ],
  }),
  component: BeritaPage,
});

function BeritaPage() {
  const [kat, setKat] = useState<(typeof categories)[number]>("Semua");
  const filtered = useMemo(
    () => (kat === "Semua" ? news : news.filter((n) => n.kategori === kat)),
    [kat],
  );

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Newsroom</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Berita pasar saham Indonesia
        </h1>
        <p className="mt-3 text-muted-foreground">
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