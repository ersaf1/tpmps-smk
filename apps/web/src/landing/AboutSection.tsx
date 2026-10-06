import React from "react";

export const AboutSection: React.FC = () => {
  const categories = [
    {
      code: "MM",
      num: "01",
      title: "Manual Mutu",
      description:
        "Pedoman induk penjaminan mutu sekolah yang memuat kebijakan, struktur organisasi, dan komitmen mutu TPMPS.",
      authority: "Ketua TPMPS & Kepala Sekolah",
      accent: "blue",
    },
    {
      code: "PM",
      num: "02",
      title: "Prosedur Mutu",
      description:
        "Standar operasional baku yang mengatur mekanisme, tata laksana, dan tanggung jawab pelaksanaan program mutu.",
      authority: "Ketua TPMPS & Unit Terkait",
      accent: "orange",
    },
    {
      code: "CM",
      num: "03",
      title: "Catatan Mutu",
      description:
        "Bukti fisik dan catatan riil pelaksanaan kegiatan mutu yang diunggah secara berkala oleh setiap unit kerja.",
      authority: "Kepala Unit Kerja & Tim Pelaksana",
      accent: "blue",
    },
    {
      code: "PK",
      num: "04",
      title: "Petunjuk Kerja",
      description:
        "Instruksi teknis rinci yang memandu operasional spesifik pada laboratorium, bengkel, perpustakaan, dan unit.",
      authority: "Kepala Unit & Penanggung Jawab Teknis",
      accent: "orange",
    },
  ];

  return (
    <section id="tentang" className="otto-section otto-about-section">
      <div className="otto-section-container">
        {/* Section Header with Editorial Index */}
        <div className="otto-section-meta">
          <span className="section-index-num">02 / TENTANG SINTESA</span>
          <div className="section-meta-line" />
        </div>

        <div className="otto-about-layout">
          {/* Left Column: Asymmetric Editorial Lead */}
          <div className="otto-about-lead">
            <h2 className="otto-section-title">
              Satu ruang untuk dokumen mutu sekolah.
            </h2>
            <p className="otto-section-lede">
              SINTESA mendukung pengelolaan dokumen Tim Penjaminan Mutu
              Pendidikan Sekolah. Manual Mutu, Prosedur Mutu, Catatan Mutu, dan
              Petunjuk Kerja tersusun dalam folder yang mudah ditelusuri oleh
              pengguna sesuai kewenangannya.
            </p>

            <div className="otto-about-statement">
              <div className="statement-line" />
              <div className="statement-body">
                <span className="statement-label">STANDARISASI SISTEM MUTU SMK</span>
                <p className="statement-text">
                  Menyatukan seluruh dokumentasi mutu kejuruan dalam tata kelola
                  arsip digital terpadu, mendukung persiapan akreditasi dan audit
                  internal tanpa berkas tercecer di berbagai media terpisah.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Typographic Catalog Matrix */}
          <div className="otto-pillars-dossier">
            {categories.map((cat) => (
              <div
                key={cat.code}
                className={`dossier-row dossier-${cat.accent}`}
              >
                <div className="dossier-index-mark">
                  <span className="dossier-num">{cat.num}</span>
                  <span className={`dossier-badge tag-${cat.accent}`}>
                    {cat.code}
                  </span>
                </div>

                <div className="dossier-content">
                  <div className="dossier-title-line">
                    <h3 className="dossier-title">{cat.title}</h3>
                    <span className="dossier-auth">{cat.authority}</span>
                  </div>
                  <p className="dossier-desc">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
