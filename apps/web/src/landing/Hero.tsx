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

        {/* Right Column: 3D Centerpiece with Otto-style Radar & Floating Badges */}
        <div className="otto-hero-visual">
          <Folder3D theme={theme} />
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
