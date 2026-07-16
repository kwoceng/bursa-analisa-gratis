
# Rencana: Website Analisa Bursa Saham Indonesia

Website gratis, tanpa login, tampilan bersih & modern terang. Semua data adalah data demo statis (bisa diganti ke API asli nanti).

## Halaman

```text
/                 Beranda — ringkasan pasar + top gainers/losers + preview berita
/saham            Daftar saham IDX (tabel: kode, nama, harga, %, volume, sektor)
/saham/$kode      Detail per saham (info, chart harga sederhana, statistik)
/watchlist        Watchlist pribadi (disimpan di localStorage)
/berita           Daftar berita pasar
/tentang          Penjelasan situs & disclaimer
```

## Fitur Utama

1. **Daftar & harga saham IDX**
   - Tabel ±30 saham demo (BBCA, BBRI, TLKM, ASII, GOTO, dst) dengan harga, perubahan, volume, market cap, sektor.
   - Pencarian by kode/nama + filter sektor + sortir kolom.
   - Ringkasan indeks (IHSG, LQ45) di atas.

2. **Detail saham** (`/saham/$kode`)
   - Header: kode, nama, sektor, harga, %perubahan.
   - Chart harga historis 30 hari (Recharts, data dummy).
   - Statistik kunci: high/low, volume, PER, PBV, dividen, kapitalisasi.
   - Tombol "Tambah ke Watchlist".

3. **Watchlist**
   - Simpan kode saham favorit di `localStorage` (tanpa login).
   - Halaman `/watchlist` menampilkan tabel saham yang disimpan, dengan tombol hapus.

4. **Berita pasar**
   - Daftar 8–10 berita demo (judul, ringkasan, tanggal, sumber, gambar).
   - Kartu berita di beranda + halaman `/berita` lengkap.

## Desain

Gaya bersih & modern terang, terinspirasi Stockbit/Ajaib namun punya karakter sendiri:
- Warna: putih/off-white, aksen biru tua profesional, hijau (naik) & merah (turun) sebagai token.
- Tipografi: pasangan display + body yang bukan Inter/Poppins (mis. Space Grotesk + IBM Plex Sans).
- Layout: kartu ringkasan di atas, tabel padat rapi, spacing generous di landing.
- Semua warna via token di `src/styles.css` (oklch), tidak ada warna hardcoded.

## Struktur Teknis

```text
src/routes/
  __root.tsx              (update title/meta + shared header/footer)
  index.tsx               (beranda — ganti placeholder)
  saham.tsx               (daftar saham)
  saham.$kode.tsx         (detail saham)
  watchlist.tsx
  berita.tsx
  tentang.tsx
src/data/
  stocks.ts               (data demo saham + harga historis)
  news.ts                 (data demo berita)
  sectors.ts
src/components/
  layout/Header.tsx, Footer.tsx
  market/StockTable.tsx, StockRow.tsx, PriceChange.tsx, MarketSummary.tsx
  stock/StockChart.tsx, StockStats.tsx
  news/NewsCard.tsx
  watchlist/WatchlistButton.tsx
src/hooks/
  use-watchlist.ts        (localStorage hook)
```

Library tambahan: `recharts` untuk grafik harga.

Setiap route mendefinisikan `head()` sendiri (title, description, og:title/description) dalam bahasa Indonesia. Disclaimer "data demo, bukan rekomendasi investasi" tampil di footer dan halaman /tentang.

## Detail Teknis

- Data disimpan sebagai array TypeScript di `src/data/*.ts` — mudah diganti ke server function bila kelak pakai API real.
- `useWatchlist` hook: baca/tulis `localStorage` di dalam `useEffect` untuk aman terhadap SSR (mengikuti aturan TanStack Start execution model).
- Tabel saham pakai state lokal untuk sort/filter (bukan URL search params dulu, agar sederhana).
- Chart pakai Recharts `LineChart` responsive.
- Warna naik/turun via CSS token: `--color-up`, `--color-down` di `src/styles.css`.
- Ganti placeholder `src/routes/index.tsx` dengan beranda sebenarnya.

## Di Luar Cakupan (V1)

- Login/akun pengguna, database Lovable Cloud.
- Data real-time / integrasi API bursa.
- Analisa teknikal otomatis (MA/RSI/MACD).
- Pemberitahuan harga.

Fitur di atas bisa ditambahkan kemudian setelah V1 berjalan.
