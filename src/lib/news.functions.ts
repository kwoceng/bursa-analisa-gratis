import { createServerFn } from "@tanstack/react-start";
import { stocks } from "@/data/stocks";

export type FeedNewsItem = {
  id: string;
  judul: string;
  ringkasan: string;
  link: string;
  tanggal: string; // ISO
  sumber: string;
  terkait?: string[];
};

const FEEDS: Array<{ url: string; sumber: string }> = [
  { url: "https://www.cnbcindonesia.com/market/rss", sumber: "CNBC Indonesia" },
  { url: "https://investasi.kontan.co.id/rss", sumber: "Kontan" },
  { url: "https://finance.detik.com/rss", sumber: "detikFinance" },
  { url: "https://www.idxchannel.com/rss", sumber: "IDX Channel" },
];

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(s: string): string {
  return decodeEntities(
    s
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function extractTag(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!m) return "";
  const raw = m[1].trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return cdata ? cdata[1].trim() : raw;
}

// Tandai berita yang menyebut nama/kode emiten yang kita punya di data saham,
// supaya bisa ditautkan seperti berita kurasi manual.
function matchRelatedStocks(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const s of stocks) {
    const codeMatch = new RegExp(`\\b${s.kode}\\b`, "i").test(text);
    const nameMatch = lower.includes(
      s.nama
        .toLowerCase()
        .replace(/\s+tbk\.?$/i, "")
        .trim(),
    );
    if (codeMatch || nameMatch) found.push(s.kode);
  }
  return found.slice(0, 4);
}

async function fetchFeed(feed: { url: string; sumber: string }): Promise<FeedNewsItem[]> {
  const res = await fetch(feed.url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; BursaKitaBot/1.0; +https://bursakita.example)",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
  });
  if (!res.ok) throw new Error(`${feed.sumber} HTTP ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return items.slice(0, 12).map((block): FeedNewsItem => {
    const title = stripHtml(extractTag(block, "title"));
    const link = stripHtml(extractTag(block, "link"));
    const pubDate = extractTag(block, "pubDate");
    const description = stripHtml(extractTag(block, "description")).slice(0, 220);
    const date = pubDate ? new Date(pubDate) : new Date();
    return {
      id: link || `${feed.sumber}-${title}`,
      judul: title,
      ringkasan: description,
      link,
      tanggal: Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
      sumber: feed.sumber,
      terkait: matchRelatedStocks(title + " " + description),
    };
  });
}

const NEWS_TTL_MS = 5 * 60_000; // 5 menit
let newsCache: { data: FeedNewsItem[]; expiresAt: number } | undefined;

export const getLiveNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ items: FeedNewsItem[]; fetchedAt: number; error?: string }> => {
    if (newsCache && newsCache.expiresAt > Date.now()) {
      return { items: newsCache.data, fetchedAt: newsCache.expiresAt - NEWS_TTL_MS };
    }
    const results = await Promise.allSettled(FEEDS.map(fetchFeed));
    const items = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
    items.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

    if (items.length === 0) {
      const errs = results
        .filter((r): r is PromiseRejectedResult => r.status === "rejected")
        .map((r) => String(r.reason))
        .join("; ");
      return { items: [], fetchedAt: Date.now(), error: errs || "Gagal memuat berita" };
    }
    newsCache = { data: items, expiresAt: Date.now() + NEWS_TTL_MS };
    return { items, fetchedAt: Date.now() };
  },
);
