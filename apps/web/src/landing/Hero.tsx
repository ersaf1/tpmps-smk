import React from "react";
import { ArrowUpRight, Compass, ChevronDown } from "lucide-react";
import { Folder3D } from "./Folder3D";

interface HeroProps {
  theme: "dark" | "light";
  onNavigateLogin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ theme, onNavigateLogin }) => {
  const handleExploreFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("fitur");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "#fitur");
    }
  };

  const handleScrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("tentang");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "#tentang");
    }
  };

  return (
    <section className="otto-hero-section">
      <div className="otto-hero-container">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="otto-hero-content">
          <div className="otto-hero-eyebrow">
            <span className="eyebrow-accent-bullet" />
            <span className="eyebrow-text">SISTEM INFORMASI TPMPS SMK</span>
          </div>

          <h1 className="otto-hero-headline">
            <span>Dokumen mutu tertata.</span>
            <span className="headline-second-line">Penjaminan mutu terjaga.</span>
          </h1>

          <p className="otto-hero-description">
            Kelola dan telusuri dokumen mutu sekolah dalam satu sistem, dengan
            akses sesuai peran dan arsip yang tersusun berdasarkan periode.
          </p>

          <div className="otto-hero-actions">
            <button
              type="button"
              className="otto-btn-primary"
              onClick={onNavigateLogin}
            >
              <span>Masuk Sistem</span>
              <ArrowUpRight size={18} strokeWidth={2.4} />
            </button>

            <a
              href="#fitur"
              className="otto-btn-secondary"
              onClick={handleExploreFeatures}
            >
              <Compass size={17} strokeWidth={2} />
              <span>Jelajahi Fitur</span>
            </a>
          </div>
        </div>

        {/* Right Column: 3D Centerpiece kept in DOM but hidden as requested */}
        <div className="otto-hero-visual">
          <div style={{ display: "none" }} aria-hidden="true">
            <Folder3D theme={theme} />
          </div>

          <div className="sintesa-hero-showcase">
            <div className="showcase-header">
              <div className="showcase-badge">
                <span className="badge-dot" />
                <span>SINTESA MASTER TEMPLATE</span>
              </div>
              <span className="showcase-tag">SMK N 2 MAGELANG</span>
            </div>

            <div className="showcase-center">
              <div className="showcase-crest-wrap">
                <img
                  src="/school-logo.png"
                  alt="Logo SMK Negeri 2 Magelang"
                  className="showcase-logo"
                />
              </div>
              <h2 className="showcase-title">SINTESA TPMPS</h2>
              <p className="showcase-subtitle">
                Penjaminan Mutu Internal Berbasis 8 Standar Nasional Pendidikan
              </p>
              <div className="showcase-motto">
                <span>SWADAYA BHINA RAHARJA</span>
              </div>
            </div>

            <div className="showcase-standards-grid">
              {[
                { code: "SNP 1", name: "Standar Kelulusan" },
                { code: "SNP 2", name: "Standar Isi" },
                { code: "SNP 3", name: "Standar Proses" },
                { code: "SNP 4", name: "Standar Penilaian" },
                { code: "SNP 5", name: "Standar PTK" },
                { code: "SNP 6", name: "Standar Sarpras" },
                { code: "SNP 7", name: "Standar Pengelolaan" },
                { code: "SNP 8", name: "Standar Pembiayaan" },
              ].map((s) => (
                <div key={s.code} className="standard-chip">
                  <span className="standard-code">{s.code}</span>
                  <span className="standard-name">{s.name}</span>
                </div>
              ))}
            </div>

            <div className="showcase-footer">
              <div className="stat-pill">
                <strong>16 Unit</strong>
                <span>Pelaksana</span>
              </div>
              <div className="stat-pill">
                <strong>PPEPP</strong>
                <span>Siklus Mutu</span>
              </div>
              <div className="stat-pill">
                <strong>100%</strong>
                <span>Sahih & RLS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Bar (Signature Otto Detail) */}
      <div className="otto-hero-bottombar">
        <div className="bottombar-left">
          <span className="bottombar-index">01 / RUANG DOKUMEN TPMPS</span>
        </div>

        <div className="bottombar-center" aria-hidden="true">
          <span className="track-dash is-active" />
          <span className="track-dash" />
          <span className="track-dash" />
        </div>

        <div className="bottombar-right">
          <a
            href="#tentang"
            className="bottombar-scroll-link"
            onClick={handleScrollToAbout}
          >
            <span>GULIR KE BAWAH</span>
            <ChevronDown size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};
