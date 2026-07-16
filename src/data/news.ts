export type NewsItem = {
  id: string;
  judul: string;
  ringkasan: string;
  isi: string;
  tanggal: string; // ISO
  sumber: string;
  kategori: "Pasar" | "Emiten" | "Makro" | "Global";
  terkait?: string[]; // kode saham
};

export const news: NewsItem[] = [
  {
    id: "ihsg-tembus-7300",
    judul: "IHSG Tembus 7.300, Ditopang Saham Perbankan dan Energi",
    ringkasan:
      "Indeks Harga Saham Gabungan menguat 0,58% ke level 7.284 pada penutupan hari ini, didorong aksi beli investor asing di saham big caps.",
    isi: "Perdagangan Bursa Efek Indonesia hari ini ditutup menguat dengan volume yang meningkat 12% dibanding rata-rata mingguan. Saham perbankan dan energi menjadi motor penggerak indeks, sementara sektor konsumsi tertekan sentimen daya beli.",
    tanggal: "2026-07-16",
    sumber: "Kajian Pasar Harian",
    kategori: "Pasar",
    terkait: ["BBCA", "BMRI", "ADRO"],
  },
  {
    id: "bbca-laba-tumbuh",
    judul: "BBCA Cetak Laba Semester I Tumbuh Dua Digit",
    ringkasan:
      "Bank Central Asia membukukan pertumbuhan laba bersih 12,4% secara tahunan ditopang ekspansi kredit korporasi dan margin yang stabil.",
    isi: "Manajemen BCA menyebut kualitas aset tetap terjaga dengan NPL di bawah 2%. Rasio CAR juga masih kuat di kisaran 28%.",
    tanggal: "2026-07-15",
    sumber: "Laporan Emiten",
    kategori: "Emiten",
    terkait: ["BBCA"],
  },
  {
    id: "bi-rate-tetap",
    judul: "BI Pertahankan Suku Bunga di 5,75%",
    ringkasan:
      "Bank Indonesia memutuskan menahan suku bunga acuan untuk menjaga stabilitas rupiah di tengah tekanan global.",
    isi: "Gubernur BI menegaskan kebijakan tetap pro-stabilitas dengan tetap membuka ruang pelonggaran bila inflasi terkendali.",
    tanggal: "2026-07-14",
    sumber: "Bank Indonesia",
    kategori: "Makro",
  },
  {
    id: "goto-fitur-baru",
    judul: "GOTO Luncurkan Fitur Investasi Terintegrasi di Aplikasi",
    ringkasan:
      "GoTo memperluas layanan fintech dengan menambahkan produk investasi reksa dana dan emas dalam satu aplikasi.",
    isi: "Ekspansi ini diharapkan meningkatkan monetisasi pengguna aktif bulanan yang saat ini mencapai 65 juta.",
    tanggal: "2026-07-13",
    sumber: "Siaran Pers",
    kategori: "Emiten",
    terkait: ["GOTO"],
  },
  {
    id: "harga-batubara-naik",
    judul: "Harga Batu Bara Global Naik, Saham ADRO dan PTBA Menguat",
    ringkasan:
      "Kenaikan harga batu bara acuan ke level USD 138/ton mengangkat harga saham emiten tambang batu bara.",
    isi: "Analis memperkirakan tren harga masih akan bertahan hingga akhir kuartal seiring permintaan musim dingin di Asia Utara.",
    tanggal: "2026-07-12",
    sumber: "Riset Pasar",
    kategori: "Emiten",
    terkait: ["ADRO", "PTBA"],
  },
  {
    id: "asing-beli-bersih",
    judul: "Asing Catat Beli Bersih Rp 1,2 Triliun dalam Sepekan",
    ringkasan:
      "Aliran dana asing kembali masuk ke pasar saham Indonesia setelah selama tiga pekan sebelumnya mengalami net sell.",
    isi: "Saham perbankan mendominasi net buy, disusul saham telekomunikasi.",
    tanggal: "2026-07-11",
    sumber: "IDX Weekly",
    kategori: "Pasar",
    terkait: ["BBCA", "BBRI", "TLKM"],
  },
  {
    id: "the-fed-dovish",
    judul: "The Fed Beri Sinyal Dovish, Pasar Asia Merespons Positif",
    ringkasan:
      "Pernyataan Ketua The Fed yang cenderung dovish memicu penguatan bursa Asia, termasuk Indonesia.",
    isi: "Ekspektasi pemangkasan suku bunga acuan AS pada kuartal akhir tahun ini semakin menguat.",
    tanggal: "2026-07-10",
    sumber: "Reuters Digest",
    kategori: "Global",
  },
  {
    id: "telkom-fiber",
    judul: "TLKM Perluas Jaringan Fiber ke 500 Kota di Indonesia Timur",
    ringkasan:
      "Telkom Indonesia mempercepat digitalisasi wilayah timur dengan investasi infrastruktur Rp 4,2 triliun.",
    isi: "Program ini menargetkan penetrasi internet cepat mencapai 85% pada 2027.",
    tanggal: "2026-07-09",
    sumber: "Laporan Emiten",
    kategori: "Emiten",
    terkait: ["TLKM"],
  },
  {
    id: "otomotif-lesu",
    judul: "Penjualan Mobil Turun 8%, Sentimen Negatif Bayangi ASII",
    ringkasan:
      "Data Gaikindo menunjukkan penurunan penjualan otomotif nasional pada semester pertama.",
    isi: "Meski demikian, ASII masih diuntungkan segmen jasa keuangan dan alat berat.",
    tanggal: "2026-07-08",
    sumber: "Gaikindo",
    kategori: "Makro",
    terkait: ["ASII"],
  },
  {
    id: "ipo-teknologi",
    judul: "Tiga Perusahaan Teknologi Antre IPO di BEI",
    ringkasan:
      "Bursa Efek Indonesia mengonfirmasi tiga calon emiten sektor teknologi sedang dalam proses book building.",
    isi: "Total dana yang ditargetkan diperkirakan mencapai Rp 6 triliun.",
    tanggal: "2026-07-07",
    sumber: "BEI",
    kategori: "Pasar",
  },
];

export function getNews(id: string) {
  return news.find((n) => n.id === id);
}