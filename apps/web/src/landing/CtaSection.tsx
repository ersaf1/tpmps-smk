import React from "react";
import { ArrowUpRight } from "lucide-react";

interface CtaSectionProps {
  onNavigateLogin: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onNavigateLogin }) => {
  return (
    <section className="otto-cta-section">
      <div className="otto-cta-container">
        <div className="otto-cta-panel">
          {/* Subtle atmospheric glow behind framed panel */}
          <div className="cta-backdrop-glow" aria-hidden="true" />
          <div className="cta-accent-ring" aria-hidden="true" />

          <div className="cta-meta-top">
            <span className="cta-meta-pill">
              AKSES RUANG DOKUMEN MUTU
            </span>
          </div>

          <h2 className="cta-headline">Mulai dari dokumen yang tertata.</h2>

          <p className="cta-description">
            Masuk ke SINTESA untuk mengakses ruang dokumen TPMPS sekolah.
          </p>

          <div className="cta-action-row">
            <button
              type="button"
              className="otto-btn-primary cta-btn-large"
              onClick={onNavigateLogin}
            >
              <span>Masuk Sistem</span>
              <ArrowUpRight size={18} strokeWidth={2.4} />
            </button>
          </div>

          <div className="cta-bottom-note">
            <span>Sistem Informasi Terpadu Sekolah untuk Administrasi Mutu</span>
          </div>
        </div>
      </div>
    </section>
  );
};
