import React from "react";
import { ArrowUp } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", href);
    }
  };

  return (
    <footer className="otto-footer">
      <div className="otto-footer-container">
        {/* Main Footer Block */}
        <div className="otto-footer-main">
          <div className="otto-footer-brand">
            <div className="footer-logo-row">
              <img
                src="/school-logo.png"
                alt="Logo Sekolah"
                className="footer-logo-img"
                width="40"
                height="40"
              />
              <div className="footer-brand-names">
                <span className="footer-brand-title">SINTESA</span>
                <span className="footer-brand-badge">Sistem Informasi TPMPS SMK</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              Sistem Informasi Terpadu Sekolah untuk Administrasi Mutu
            </p>
          </div>

          <div className="otto-footer-nav">
            <div className="footer-nav-col">
              <span className="footer-nav-heading">NAVIGASI HALAMAN</span>
              <a
                href="#tentang"
                className="footer-nav-link"
                onClick={(e) => handleLinkClick(e, "#tentang")}
              >
                Tentang SINTESA
              </a>
              <a
                href="#fitur"
                className="footer-nav-link"
                onClick={(e) => handleLinkClick(e, "#fitur")}
              >
                Fitur Sistem
              </a>
              <a
                href="#alur"
                className="footer-nav-link"
                onClick={(e) => handleLinkClick(e, "#alur")}
              >
                Alur Penggunaan
              </a>
            </div>

            <div className="footer-nav-col">
              <span className="footer-nav-heading">DOKUMEN MUTU</span>
              <span className="footer-doc-pill">MM · Manual Mutu</span>
              <span className="footer-doc-pill">PM · Prosedur Mutu</span>
              <span className="footer-doc-pill">CM · Catatan Mutu</span>
              <span className="footer-doc-pill">PK · Petunjuk Kerja</span>
            </div>
          </div>
        </div>

        {/* Bottom Hairline Row */}
        <div className="otto-footer-bottom">
          <div className="footer-bottom-left">
            <span>© 2026 SINTESA. Seluruh hak cipta dilindungi.</span>
            <span className="footer-dot-sep">·</span>
            <span>Sistem Informasi TPMPS SMK</span>
          </div>

          <button
            type="button"
            className="footer-back-to-top"
            onClick={scrollToTop}
            aria-label="Kembali ke atas halaman"
          >
            <span>Kembali ke atas</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
