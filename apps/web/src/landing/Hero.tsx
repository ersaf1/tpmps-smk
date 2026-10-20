import React from "react";
import { ArrowUpRight, Compass, ChevronDown, CheckCircle2 } from "lucide-react";
import { HeroShowcase } from "./HeroShowcase";

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
        {/* Unified Section 01 Header */}
        <div className="otto-section-meta hero-section-meta">
          <div className="section-index-badge">
            <span className="section-index-num">01</span>
            <span className="section-index-sep">/</span>
            <span className="section-index-name">RUANG DOKUMEN TPMPS</span>
          </div>
          <div className="section-meta-line" />
        </div>

        {/* Hero Main Grid: Left Copy & Right Interactive Showcase */}
        <div className="otto-hero-grid">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="otto-hero-content">
            <div className="otto-hero-eyebrow">
              <span className="eyebrow-accent-bullet" />
              <span className="eyebrow-text">SMK NEGERI 2 MAGELANG</span>
            </div>

            <h1 className="otto-hero-headline">
              <span>Sistem Penjaminan Mutu</span>
              <span className="headline-second-line">Pendidikan Sekolah</span>
            </h1>

            <p className="otto-hero-description">
              Pusat pengelolaan dokumen mutu, manual prosedur, instrumen evaluasi,
              dan arsip digital SPMI SMKN 2 Magelang berbasis tata kelola terpadu.
            </p>

            <div className="otto-hero-actions">
              <button
                type="button"
                className="otto-btn-primary"
                onClick={onNavigateLogin}
              >
                <span>Masuk Portal TPMPS</span>
                <ArrowUpRight size={18} strokeWidth={2.4} />
              </button>

              <a
                href="#fitur"
                className="otto-btn-secondary"
                onClick={handleExploreFeatures}
              >
                <Compass size={17} strokeWidth={2} />
                <span>Struktur Instrumen</span>
              </a>
            </div>

            {/* Quick reassurance tags */}
            <div className="otto-hero-trust-row">
              <span className="trust-pill">
                <CheckCircle2 size={13} className="trust-icon" />
                <span>Dokumen MM, PM, CM, PK</span>
              </span>
              <span className="trust-pill">
                <CheckCircle2 size={13} className="trust-icon" />
                <span>Kapasitas Unggah 50 MB per Berkas</span>
              </span>
            </div>
          </div>

          {/* Right Column: High-end Interactive Document Showcase (No 3D) */}
          <div className="otto-hero-visual">
            <HeroShowcase theme={theme} />
          </div>
        </div>
      </div>

      {/* Hero Bottom Navigation & Highlights Strip */}
      <div className="otto-hero-bottombar">
        <div className="bottombar-highlights">
          <span className="bottombar-tag">STANDAR TATA KELOLA</span>
          <span className="bottombar-item">Manual Mutu (MM)</span>
          <span className="bottombar-dot">·</span>
          <span className="bottombar-item">Prosedur Mutu (PM)</span>
          <span className="bottombar-dot">·</span>
          <span className="bottombar-item">Catatan Mutu (CM)</span>
          <span className="bottombar-dot">·</span>
          <span className="bottombar-item">Petunjuk Kerja (PK)</span>
        </div>

        <div className="bottombar-right">
          <a
            href="#tentang"
            className="bottombar-scroll-link"
            onClick={handleScrollToAbout}
          >
            <span>PELAJARI SISTEM</span>
            <ChevronDown size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};
