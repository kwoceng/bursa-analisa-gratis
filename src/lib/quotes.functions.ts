import { createServerFn } from "@tanstack/react-start";

export type LiveQuote = {
  symbol: string;
  label: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  marketState: string;
  timestamp: number; // seconds
};

type YahooChartResponse = {
  chart: {
    result?: Array<{
      meta: {
        regularMarketPrice: number;
        chartPreviousClose?: number;
        previousClose?: number;
        currency: string;
        marketState: string;
        regularMarketTime?: number;
        symbol: string;
      };
    }>;
    error?: { code: string; description: string } | null;
  };
};

async function fetchYahooQuote(symbol: string, label: string): Promise<LiveQuote> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol,
  )}?interval=1d&range=5d`;
  const res = await fetch(url, {
    headers: {
      // Yahoo blocks requests without a UA
      "User-Agent":
        "Mozilla/5.0 (compatible; BursaKita/1.0; +https://bursakita.example)",
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`Yahoo ${symbol} HTTP ${res.status}`);
  const json = (await res.json()) as YahooChartResponse;
  const r = json.chart.result?.[0];
  if (!r) throw new Error(`Yahoo ${symbol} no data`);
  const price = r.meta.regularMarketPrice;
  const prev = r.meta.chartPreviousClose ?? r.meta.previousClose ?? price;
  const change = price - prev;
  const changePercent = prev !== 0 ? (change / prev) * 100 : 0;
  return {
    symbol,
    label,
    price,
    previousClose: prev,
    change,
    changePercent,
    currency: r.meta.currency,
    marketState: r.meta.marketState,
    timestamp: r.meta.regularMarketTime ?? Math.floor(Date.now() / 1000),
  };
}

// Indeks yang tersedia di Yahoo Finance untuk pasar Indonesia.
// IHSG = ^JKSE. LQ45/IDX30 tidak tersedia sebagai simbol di Yahoo, jadi kita hanya
// menyediakan IHSG live; indeks lain tetap ditandai demo di UI.
const INDEX_SYMBOLS: Array<{ symbol: string; label: string }> = [
  { symbol: "^JKSE", label: "IHSG" },
];

export const getLiveIndices = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ quotes: LiveQuote[]; fetchedAt: number; error?: string }> => {
    try {
      const quotes = await Promise.all(
        INDEX_SYMBOLS.map((s) => fetchYahooQuote(s.symbol, s.label)),
      );
      return { quotes, fetchedAt: Date.now() };
    } catch (err) {
      return {
        quotes: [],
        fetchedAt: Date.now(),
        error: err instanceof Error ? err.message : "Gagal memuat harga",
      };
    }
  },
);