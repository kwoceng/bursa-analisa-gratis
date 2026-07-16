import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Trash2 } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { PriceChange } from "@/components/market/PriceChange";
import { getStock } from "@/data/stocks";
import { useWatchlist } from "@/hooks/use-watchlist";
import { formatRupiah, formatVolume } from "@/lib/format";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist Saya — BursaKita" },
      {
        name: "description",
        content:
          "Saham favorit yang Anda simpan tersimpan aman di peramban ini. Tanpa login, tanpa registrasi.",
      },
      { property: "og:title", content: "Watchlist Saya — BursaKita" },
      {
        property: "og:description",
        content: "Lacak saham favorit Anda tanpa harus mendaftar.",
      },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const { items, remove, hydrated } = useWatchlist();
  const rows = items.map((k) => getStock(k)).filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Personalisasi</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Watchlist saya
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Daftar saham yang Anda simpan disimpan lokal di peramban ini. Bersihkan riwayat peramban
          akan menghapus watchlist.
        </p>

        {!hydrated && (
          <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Memuat watchlist…
          </div>
        )}

        {hydrated && rows.length === 0 && (
          <div className="mt-10 rounded-xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
            <Star className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
              Watchlist masih kosong
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Buka halaman detail sebuah saham dan tekan tombol "Tambah ke Watchlist" untuk
              menyimpannya di sini.
            </p>
            <Link
              to="/saham"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Jelajahi daftar saham
            </Link>
          </div>
        )}

        {hydrated && rows.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-xl border border-border/60 bg-card shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border/60 bg-muted/40">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2.5">Kode</th>
                  <th className="hidden px-3 py-2.5 md:table-cell">Nama</th>
                  <th className="px-3 py-2.5 text-right">Harga</th>
                  <th className="px-3 py-2.5 text-right">Perubahan</th>
                  <th className="hidden px-3 py-2.5 text-right sm:table-cell">Volume</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rows.map((s) => (
                  <tr key={s.kode} className="hover:bg-muted/40">
                    <td className="px-3 py-3">
                      <Link
                        to="/saham/$kode"
                        params={{ kode: s.kode }}
                        className="font-display text-sm font-semibold text-foreground hover:text-primary"
                      >
                        {s.kode}
                      </Link>
                    </td>
                    <td className="hidden max-w-[280px] truncate px-3 py-3 text-muted-foreground md:table-cell">
                      {s.nama}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      Rp {formatRupiah(s.harga)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <PriceChange
                        value={s.perubahan}
                        percent={s.perubahanPersen}
                        size="sm"
                        showAbsolute={false}
                      />
                    </td>
                    <td className="hidden px-3 py-3 text-right tabular-nums text-muted-foreground sm:table-cell">
                      {formatVolume(s.volume)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => remove(s.kode)}
                        aria-label={`Hapus ${s.kode} dari watchlist`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
