import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang BursaKita — Analisa Bursa Saham Indonesia" },
      {
        name: "description",
        content:
          "BursaKita adalah platform edukasi pasar modal Indonesia. Data demo, gratis, tanpa registrasi.",
      },
      { property: "og:title", content: "Tentang BursaKita" },
      {
        property: "og:description",
        content: "Platform edukasi pasar modal Indonesia — gratis untuk semua.",
      },
    ],
  }),
  component: TentangPage,
});

function TentangPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Tentang</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground">
          Analisa Bursa Efek Indonesia untuk semua orang
        </h1>
        <div className="prose prose-slate mt-6 max-w-none text-foreground/90">
          <p>
            <strong>BursaKita</strong> adalah proyek edukasi yang menghadirkan cara sederhana
            untuk mempelajari pergerakan saham di Bursa Efek Indonesia. Kami percaya
            informasi pasar modal seharusnya mudah diakses, gratis, dan tidak membingungkan
            bagi pemula.
          </p>

          <h2 className="font-display">Apa yang bisa Anda lakukan di sini</h2>
          <ul>
            <li>Memantau ringkasan indeks utama seperti IHSG, LQ45, dan IDX30.</li>
            <li>Melihat daftar saham unggulan lengkap dengan harga, volume, dan valuasi.</li>
            <li>Mendalami detail per saham dengan grafik harga dan statistik kunci.</li>
            <li>Menyusun watchlist saham favorit — semuanya tersimpan lokal di peramban.</li>
            <li>Membaca ringkasan berita pasar yang relevan.</li>
          </ul>

          <h2 className="font-display">Sumber data</h2>
          <p>
            Seluruh data yang ditampilkan saat ini merupakan <em>data demonstrasi</em> yang
            dirancang menyerupai kondisi pasar nyata, namun bukan angka perdagangan aktual di
            BEI. Ini memungkinkan Anda mencoba antarmuka dan alur analisa tanpa
            ketergantungan pada penyedia data pihak ketiga.
          </p>

          <h2 className="font-display">Disclaimer penting</h2>
          <p>
            Konten pada situs ini <strong>bukan rekomendasi jual atau beli</strong> maupun
            nasihat investasi. Investasi di pasar modal mengandung risiko, termasuk potensi
            kehilangan sebagian atau seluruh modal. Selalu lakukan riset independen dan/atau
            berkonsultasi dengan penasihat keuangan berlisensi sebelum mengambil keputusan.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/saham"
            className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Mulai jelajahi saham
          </Link>
          <Link
            to="/berita"
            className="inline-flex items-center rounded-md border border-input bg-background px-5 py-3 text-sm font-medium text-foreground hover:bg-accent"
          >
            Baca berita pasar
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}