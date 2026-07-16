import { createServerFn } from "@tanstack/react-start";
import { stocks } from "@/data/stocks";

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

export type LiveStockQuote = {
  kode: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  high52: number;
  low52: number;
};

export type HistoryPoint = { tanggal: string; harga: number };

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
      "User-Agent": "Mozilla/5.0 (compatible; BursaKita/1.0; +https://bursakita.example)",
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

// --- Live quotes untuk seluruh daftar saham (batch, via Yahoo Finance "spark") ---

type YahooSparkMeta = {
  symbol: string;
  regularMarketPrice: number;
  chartPreviousClose?: number;
  regularMarketVolume?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
};

type YahooSparkResponse = {
  spark: {
    result?: Array<{
      symbol: string;
      response: Array<{ meta: YahooSparkMeta }>;
    }>;
    error?: { code: string; description: string } | null;
  };
};

// Yahoo menolak request "spark" dengan lebih dari ~20 simbol sekaligus (400 Bad Request),
// jadi kita pecah jadi beberapa batch kecil dan gabungkan hasilnya.
const SPARK_CHUNK_SIZE = 15;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function fetchSparkChunk(symbols: string[]): Promise<Map<string, YahooSparkMeta>> {
  const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(
    symbols.join(","),
  )}&range=5d&interval=1d`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; BursaKita/1.0; +https://bursakita.example)",
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`Yahoo spark HTTP ${res.status}`);
  const json = (await res.json()) as YahooSparkResponse;
  const map = new Map<string, YahooSparkMeta>();
  for (const r of json.spark.result ?? []) {
    const meta = r.response[0]?.meta;
    if (meta) map.set(r.symbol, meta);
  }
  return map;
}

const STOCK_QUOTES_TTL_MS = 20_000;
let stockQuotesCache: { data: LiveStockQuote[]; expiresAt: number } | undefined;

export const getLiveStockQuotes = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ quotes: LiveStockQuote[]; fetchedAt: number; error?: string }> => {
    if (stockQuotesCache && stockQuotesCache.expiresAt > Date.now()) {
      return {
        quotes: stockQuotesCache.data,
        fetchedAt: stockQuotesCache.expiresAt - STOCK_QUOTES_TTL_MS,
      };
    }
    const codes = stocks.map((s) => s.kode);
    const batches = chunk(codes, SPARK_CHUNK_SIZE);
    try {
      const chunks = await Promise.all(
        batches.map((batch) => fetchSparkChunk(batch.map((k) => `${k}.JK`))),
      );
      const merged = new Map<string, YahooSparkMeta>();
      chunks.forEach((m) => m.forEach((v, k) => merged.set(k, v)));

      const quotes: LiveStockQuote[] = [];
      for (const kode of codes) {
        const meta = merged.get(`${kode}.JK`);
        if (!meta) continue;
        const price = meta.regularMarketPrice;
        const prev = meta.chartPreviousClose ?? price;
        const change = price - prev;
        quotes.push({
          kode,
          price,
          previousClose: prev,
          change,
          changePercent: prev !== 0 ? (change / prev) * 100 : 0,
          volume: meta.regularMarketVolume ?? 0,
          high52: meta.fiftyTwoWeekHigh ?? price,
          low52: meta.fiftyTwoWeekLow ?? price,
        });
      }
      if (quotes.length === 0) throw new Error("Tidak ada data dari Yahoo Finance");
      stockQuotesCache = { data: quotes, expiresAt: Date.now() + STOCK_QUOTES_TTL_MS };
      return { quotes, fetchedAt: Date.now() };
    } catch (err) {
      return {
        quotes: [],
        fetchedAt: Date.now(),
        error: err instanceof Error ? err.message : "Gagal memuat harga saham",
      };
    }
  },
);

// --- Riwayat harga 3 bulan untuk grafik halaman detail saham ---

export const getStockHistory = createServerFn({ method: "GET" })
  .validator((kode: string) => kode)
  .handler(async ({ data: kode }): Promise<{ points: HistoryPoint[]; error?: string }> => {
    const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(
      `${kode}.JK`,
    )}&range=3mo&interval=1d`;
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BursaKita/1.0; +https://bursakita.example)",
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error(`Yahoo spark HTTP ${res.status}`);
      const json = (await res.json()) as {
        spark: {
          result?: Array<{
            response: Array<{
              timestamp?: number[];
              indicators: { quote: Array<{ close?: Array<number | null> }> };
            }>;
          }>;
        };
      };
      const r = json.spark.result?.[0]?.response[0];
      const timestamps = r?.timestamp ?? [];
      const closes = r?.indicators.quote[0]?.close ?? [];
      const points: HistoryPoint[] = [];
      for (let i = 0; i < timestamps.length; i++) {
        const harga = closes[i];
        if (harga == null) continue;
        points.push({
          tanggal: new Date(timestamps[i] * 1000).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          }),
          harga: Math.round(harga),
        });
      }
      if (points.length === 0) throw new Error("Tidak ada riwayat harga");
      return { points };
    } catch (err) {
      return {
        points: [],
        error: err instanceof Error ? err.message : "Gagal memuat riwayat harga",
      };
    }
  });
