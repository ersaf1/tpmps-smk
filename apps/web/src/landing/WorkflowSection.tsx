import React from "react";

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      stage: "TAHAP 01",
      title: "Masuk dengan akun sekolah",
      desc: "Akun dan peran disiapkan secara terpusat oleh superadmin sekolah, menjamin setiap staf masuk dengan identitas dan hak akses yang sah.",
      meta: "Kredensial Terverifikasi & Peran Tertaut",
    },
    {
      num: "02",
      stage: "TAHAP 02",
      title: "Pilih periode dan ruang dokumen",
      desc: "Akses folder sesuai kewenangan pengguna. Telusuri folder MM, PM, CM, atau PK berdasarkan tahun ajaran dan periode mutu yang dipilih.",
      meta: "Navigasi Berdasarkan Unit Kerja & Waktu",
    },
    {
      num: "03",
      stage: "TAHAP 03",
      title: "Kelola atau telusuri dokumen",
      desc: "Unggah saat periode aktif dan baca arsip setelah periode selesai. Dokumen tersimpan aman dalam format aslinya untuk audit dan evaluasi.",
      meta: "Penyimpanan 50 MB & Penguncian Otomatis",
    },
  ];

  return (
    <section id="alur" className="otto-section otto-workflow-section">
      <div className="otto-section-container">
        {/* Section Header */}
        <div className="otto-section-meta">
          <span className="section-index-num">04 / ALUR PENGGUNAAN</span>
          <div className="section-meta-line" />
        </div>

        <div className="otto-workflow-header">
          <h2 className="otto-section-title">
            Dari dokumen kerja menjadi arsip sekolah.
          </h2>
          <p className="otto-section-lede">
            Siklus tertib administrasi yang memandu seluruh unit kerja dari
            penyusunan berkas hingga penguncian arsip permanen.
          </p>
        </div>

        {/* Steps with Monumental Editorial Numbers and Hairline Separators */}
        <div className="otto-workflow-chronicle">
          {steps.map((step) => (
            <div key={step.num} className="chronicle-row">
              <div className="chronicle-num-col">
                <span className="chronicle-huge-num">{step.num}</span>
              </div>

              <div className="chronicle-main-col">
                <div className="chronicle-meta-line">
                  <span className="chronicle-stage-badge">{step.stage}</span>
                  <span className="chronicle-note">{step.meta}</span>
                </div>
                <h3 className="chronicle-title">{step.title}</h3>
                <p className="chronicle-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
