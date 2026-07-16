import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Stock } from "@/data/stocks";
import type { LiveStockQuote } from "@/lib/quotes.functions";
import { mergeLiveStock } from "@/hooks/use-live-quotes";
import { formatMarketCap, formatRupiah, formatVolume } from "@/lib/format";
import { PriceChange } from "./PriceChange";

type SortKey = "kode" | "harga" | "perubahanPersen" | "volume" | "marketCap";

export function StockTable({
  data,
  compact = false,
  liveByKode,
}: {
  data: Stock[];
  compact?: boolean;
  liveByKode?: Map<string, LiveStockQuote>;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [asc, setAsc] = useState(false);

  const merged = useMemo(
    () => data.map((s) => mergeLiveStock(s, liveByKode?.get(s.kode))),
    [data, liveByKode],
  );

  const sorted = useMemo(() => {
    const arr = [...merged];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return asc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return arr;
  }, [merged, sortKey, asc]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setAsc(!asc);
    else {
      setSortKey(k);
      setAsc(k === "kode");
    }
  };

  const Th = ({
    k,
    label,
    align = "right",
  }: {
    k: SortKey;
    label: string;
    align?: "left" | "right";
  }) => (
    <th
      className={`cursor-pointer select-none px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground ${align === "right" ? "text-right" : "text-left"}`}
      onClick={() => toggleSort(k)}
    >
      <span
        className={`inline-flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : ""}`}
      >
        {label}
        {sortKey === k ? (
          asc ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : null}
      </span>
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-card shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="border-b border-border/60 bg-muted/40">
          <tr>
            <Th k="kode" label="Kode" align="left" />
            <th className="hidden px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
              Nama
            </th>
            <Th k="harga" label="Harga" />
            <Th k="perubahanPersen" label="Perubahan" />
            {!compact && <Th k="volume" label="Volume" />}
            {!compact && <Th k="marketCap" label="Kapitalisasi" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {sorted.map((s) => (
            <tr key={s.kode} className="group transition-colors hover:bg-muted/40">
              <td className="px-3 py-3">
                <Link to="/saham/$kode" params={{ kode: s.kode }} className="flex flex-col">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="font-display text-sm font-semibold text-foreground group-hover:text-primary">
                      {s.kode}
                    </span>
                    {s.isLive && (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-up animate-pulse"
                        title="Harga live"
                      />
                    )}
                  </span>
                  <span className="text-[11px] text-muted-foreground md:hidden">{s.nama}</span>
                </Link>
              </td>
              <td className="hidden max-w-[280px] truncate px-3 py-3 text-muted-foreground md:table-cell">
                {s.nama}
                <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                  {s.sektor}
                </span>
              </td>
              <td className="px-3 py-3 text-right font-medium tabular-nums text-foreground">
                {formatRupiah(s.harga)}
              </td>
              <td className="px-3 py-3 text-right">
                <PriceChange
                  value={s.perubahan}
                  percent={s.perubahanPersen}
                  size="sm"
                  showAbsolute={false}
                />
              </td>
              {!compact && (
                <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                  {formatVolume(s.volume)}
                </td>
              )}
              {!compact && (
                <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                  Rp {formatMarketCap(s.marketCap)}
                </td>
              )}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={6} className="px-3 py-10 text-center text-sm text-muted-foreground">
                Tidak ada saham yang cocok dengan filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
