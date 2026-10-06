import React from "react";

export const FeaturesSection: React.FC = () => {
  return (
    <section id="fitur" className="otto-section otto-features-section">
      <div className="otto-section-container">
        {/* Section Header */}
        <div className="otto-section-meta">
          <span className="section-index-num">03 / FITUR SISTEM</span>
          <div className="section-meta-line" />
        </div>

        <div className="otto-features-header">
          <h2 className="otto-section-title">
            Tertata untuk kebutuhan kerja TPMPS.
          </h2>
          <p className="otto-section-lede">
            Empat fondasi teknis yang dirancang khusus untuk alur penjaminan mutu
            pendidikan kejuruan, memastikan dokumen teratur, aman, dan siap
            diaudit sewaktu-waktu.
          </p>
        </div>

        {/* Editorial Feature Composition */}
        <div className="otto-features-layout">
          {/* Feature 1: Folder bertingkat (Wide Architectural Showcase) */}
          <div className="feature-block feature-block-wide">
            <div className="feature-meta-head">
              <span className="feature-num-tag">FITUR 01</span>
              <span className="feature-kicker">Struktur Hirarkis Terpadu</span>
            </div>

            <div className="feature-wide-grid">
              <div className="feature-wide-copy">
                <h3 className="feature-title">Folder bertingkat</h3>
                <p className="feature-desc">
                  Kelompokkan dokumen dalam folder dan subfolder secara sistematis.
                  Setiap ruang penjaminan mutu memiliki kedalaman struktur yang
                  rapi untuk menampung instrumen standar, prosedur kerja, hingga
                  lampiran bukti fisik setiap unit kejuruan.
                </p>
              </div>

              <div className="feature-directory-preview" aria-hidden="true">
                <div className="dir-root-bar">
                  <span className="dir-dot" />
                  <span className="dir-path">Periode 2026/2027 · Ruang Dokumen TPMPS</span>
                </div>
                <div className="dir-tree-list">
                  <div className="dir-row">
                    <span className="dir-prefix">├─</span>
                    <span className="dir-code code-blue">MM</span>
                    <span className="dir-name">Manual Mutu Sekolah</span>
                  </div>
                  <div className="dir-row">
                    <span className="dir-prefix">├─</span>
                    <span className="dir-code code-orange">PM</span>
                    <span className="dir-name">Prosedur Operasional Baku</span>
                    <span className="dir-badge">Subfolder Unit</span>
                  </div>
                  <div className="dir-row">
                    <span className="dir-prefix">├─</span>
                    <span className="dir-code code-blue">CM</span>
                    <span className="dir-name">Catatan Mutu & Bukti Fisik</span>
                  </div>
                  <div className="dir-row">
                    <span className="dir-prefix">└─</span>
                    <span className="dir-code code-orange">PK</span>
                    <span className="dir-name">Petunjuk Kerja Bengkel & Lab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 & 3: Two-Column Architectural Pair */}
          <div className="feature-dual-grid">
            {/* Feature 2: Akses sesuai peran */}
            <div className="feature-block">
              <div className="feature-meta-head">
                <span className="feature-num-tag">FITUR 02</span>
                <span className="feature-kicker">Tata Kelola Kewenangan</span>
              </div>

              <h3 className="feature-title">Akses sesuai peran</h3>
              <p className="feature-desc">
                Kepala sekolah, ketua TPMPS, kepala unit dan superadmin memiliki
                kewenangan masing-masing. Hak baca, unggah, dan kelola dokumen
                dibatasi secara ketat sesuai tanggung jawab penjaminan mutu.
              </p>

              <div className="feature-matrix-list">
                <div className="matrix-item">
                  <span className="matrix-role">Kepala Sekolah</span>
                  <span className="matrix-desc">Audit & Evaluasi Mutu</span>
                </div>
                <div className="matrix-item">
                  <span className="matrix-role">Ketua TPMPS</span>
                  <span className="matrix-desc">Pengesahan Dokumen MM & PM</span>
                </div>
                <div className="matrix-item">
                  <span className="matrix-role">Kepala Unit</span>
                  <span className="matrix-desc">Pengunggahan Bukti CM & PK</span>
                </div>
                <div className="matrix-item">
                  <span className="matrix-role">Superadmin</span>
                  <span className="matrix-desc">Otorisasi & Manajemen Akun</span>
                </div>
              </div>
            </div>

            {/* Feature 3: Upload hingga 50 MB per file */}
            <div className="feature-block">
              <div className="feature-meta-head">
                <span className="feature-num-tag">FITUR 03</span>
                <span className="feature-kicker">Kapasitas Maksimal Berkas</span>
              </div>

              <h3 className="feature-title">Upload hingga 50 MB per file</h3>
              <p className="feature-desc">
                Simpan beragam jenis dokumen pendukung termasuk laporan evaluasi,
                instrumen akreditasi, portofolio kejuruan, dan bukti kegiatan
                tanpa kendala pembatasan berkas berukuran kecil.
              </p>

              <div className="feature-capacity-display">
                <div className="capacity-hero-num">
                  <span className="cap-num">50</span>
                  <span className="cap-unit">MB</span>
                </div>
                <div className="capacity-details">
                  <span className="cap-label">Batas Unggah per File</span>
                  <span className="cap-types">
                    Mendukung PDF, Word, Spreadsheet, dan Arsip Bukti Mutu
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Arsip berdasarkan periode (Full-Width Assurance Banner) */}
          <div className="feature-block feature-block-wide">
            <div className="feature-meta-head">
              <span className="feature-num-tag">FITUR 04</span>
              <span className="feature-kicker">Integritas Arsip Historis</span>
            </div>

            <div className="feature-lock-layout">
              <div className="feature-lock-copy">
                <h3 className="feature-title">Arsip berdasarkan periode</h3>
                <p className="feature-desc">
                  Periode selesai tetap dapat dibaca dan diunduh, dengan perubahan
                  dikunci. Menjamin rekam jejak historis penjaminan mutu sekolah
                  tetap autentik dan dapat diaudit sewaktu-waktu tanpa risiko
                  perubahan yang tidak disengaja.
                </p>
              </div>

              <div className="feature-lock-panel" aria-hidden="true">
                <div className="lock-status-indicator">
                  <span className="lock-live-dot" />
                  <span className="lock-status-text">
                    STATUS PERIODE LAMPAU : TERKUNCI (READ-ONLY)
                  </span>
                </div>
                <p className="lock-status-note">
                  Hak modifikasi dan penghapusan ditutup otomatis saat masa periode
                  berakhir demi keaslian data akreditasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
