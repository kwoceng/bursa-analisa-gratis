import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getLiveStockQuotes, type LiveStockQuote } from "@/lib/quotes.functions";
import type { Stock } from "@/data/stocks";

export function useLiveStockQuotes() {
  const fetchLive = useServerFn(getLiveStockQuotes);
  const query = useQuery({
    queryKey: ["live-stock-quotes"],
    queryFn: () => fetchLive(),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
  });

  const byKode = new Map<string, LiveStockQuote>();
  query.data?.quotes.forEach((q) => byKode.set(q.kode, q));

  return { ...query, byKode };
}

// Menggabungkan harga live ke data statis (nama, sektor, PER, dsb tetap dari data demo
// karena tidak tersedia gratis dari Yahoo Finance).
export function mergeLiveStock(stock: Stock, live?: LiveStockQuote): Stock & { isLive: boolean } {
  if (!live) return { ...stock, isLive: false };
  return {
    ...stock,
    harga: live.price,
    perubahan: live.change,
    perubahanPersen: live.changePercent,
    volume: live.volume || stock.volume,
    high52: live.high52,
    low52: live.low52,
    isLive: true,
  };
}
