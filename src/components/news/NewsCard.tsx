import { Link } from "@tanstack/react-router";
import type { NewsItem } from "@/data/news";
import { formatTanggal } from "@/lib/format";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      to="/berita"
      hash={item.id}
      className="group flex h-full flex-col rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
          {item.kategori}
        </span>
        <span className="text-muted-foreground">{formatTanggal(item.tanggal)}</span>
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
        {item.judul}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{item.ringkasan}</p>
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Sumber: {item.sumber}</span>
        {item.terkait && item.terkait.length > 0 && (
          <div className="flex gap-1">
            {item.terkait.slice(0, 3).map((k) => (
              <span key={k} className="rounded bg-accent px-1.5 py-0.5 font-mono font-medium text-accent-foreground">
                {k}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}