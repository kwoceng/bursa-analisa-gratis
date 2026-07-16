import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "bursa-watchlist-v1";

function readStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  // Hydration-safe: start empty on SSR and initial render, load from storage after mount.
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items, hydrated]);

  const add = useCallback((kode: string) => {
    setItems((prev) => (prev.includes(kode) ? prev : [...prev, kode]));
  }, []);
  const remove = useCallback((kode: string) => {
    setItems((prev) => prev.filter((k) => k !== kode));
  }, []);
  const toggle = useCallback((kode: string) => {
    setItems((prev) => (prev.includes(kode) ? prev.filter((k) => k !== kode) : [...prev, kode]));
  }, []);
  const has = useCallback((kode: string) => items.includes(kode), [items]);

  return { items, add, remove, toggle, has, hydrated };
}