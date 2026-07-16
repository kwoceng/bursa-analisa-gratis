import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Bursa<span className="text-primary">Kita</span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Platform edukasi analisa Bursa Efek Indonesia. Data harga, berita pasar, dan watchlist
              pribadi — bebas biaya untuk semua.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Navigasi</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/saham" className="hover:text-foreground">
                  Daftar Saham
                </Link>
              </li>
              <li>
                <Link to="/berita" className="hover:text-foreground">
                  Berita Pasar
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-foreground">
                  Watchlist
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-foreground">
                  Tentang
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Disclaimer</h4>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Seluruh data pada situs ini bersifat demonstrasi dan tidak mencerminkan harga
              perdagangan aktual di BEI. Konten yang ditampilkan bukan rekomendasi jual/beli maupun
              nasihat investasi. Segala keputusan investasi adalah tanggung jawab pengguna.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} BursaKita. Dibuat untuk edukasi pasar modal Indonesia.
        </div>
      </div>
    </footer>
  );
}
