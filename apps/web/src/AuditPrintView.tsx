import React from "react";
import { ArrowLeft, Printer, ShieldCheck, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import type { DocumentItem } from "./domain";

interface AuditPrintViewProps {
  doc: DocumentItem;
  onBack: () => void;
}

export function AuditPrintView({ doc, onBack }: AuditPrintViewProps) {
  const formatDateIndo = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const printDate = formatDateIndo(doc.tanggal_audit || new Date().toISOString());

  return (
    <div className="audit-print-container">
      {/* Tombol aksi di layar (disembunyikan saat dicetak) */}
      <div className="audit-print-actions no-print">
        <button className="button-ghost" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={16} /> Kembali ke Direktori
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="button-primary"
            onClick={() => window.print()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#0284c7",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
            }}
          >
            <Printer size={18} /> Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Lembar Dokumen Siap Cetak (A4 Standard) */}
      <div className="audit-print-sheet">
        {/* Kop Surat Resmi */}
        <div className="kop-surat">
          <img src="/school-logo.png" alt="Logo Sekolah" className="kop-logo" />
          <div className="kop-text">
            <h4>PEMERINTAH PROVINSI JAWA TENGAH</h4>
            <h4>DINAS PENDIDIKAN DAN KEBUDAYAAN</h4>
            <h3>SMK NEGERI 2 MAGELANG</h3>
            <h2>TIM PENJAMINAN MUTU PENDIDIKAN SEKOLAH (TPMPS)</h2>
            <p>Jalan Perintis Kemerdekaan No. 32, Kota Magelang, Jawa Tengah 56115</p>
            <p>Telepon: (0293) 362552 · Faksimile: (0293) 362552 · Laman: smkn2magelang.sch.id</p>
          </div>
        </div>
        <div className="kop-divider-double" />

        {/* Judul Laporan */}
        <div className="laporan-title-section">
          <h2 className="laporan-title">LAPORAN HASIL AUDIT DOKUMEN MUTU SEKOLAH</h2>
          <span className="laporan-nomor">
            Nomor Registrasi Audit: AUD-{doc.nomor_dokumen || doc.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* Bagian 1: Identitas Dokumen */}
        <div className="print-section">
          <h3 className="section-heading">I. IDENTITAS DOKUMEN</h3>
          <table className="print-table-info">
            <tbody>
              <tr>
                <td style={{ width: "28%" }}>Nomor Dokumen</td>
                <td style={{ width: "3%" }}>:</td>
                <td><strong>{doc.nomor_dokumen}</strong></td>
              </tr>
              <tr>
                <td>Nama Dokumen</td>
                <td>:</td>
                <td><strong>{doc.nama_dokumen}</strong></td>
              </tr>
              <tr>
                <td>Unit / Bagian Kerja</td>
                <td>:</td>
                <td>{doc.unit}</td>
              </tr>
              <tr>
                <td>Posisi / Letak Penyimpanan</td>
                <td>:</td>
                <td><strong>{doc.letak_dokumen}</strong></td>
              </tr>
              <tr>
                <td>Tanggal Dilakukan Audit</td>
                <td>:</td>
                <td>{printDate}</td>
              </tr>
              <tr>
                <td>Status Keputusan Audit</td>
                <td>:</td>
                <td>
                  <span
                    className={`status-print-badge status-${doc.status_approval}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 10px",
                      borderRadius: 4,
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {doc.status_approval === "approved" && "✔ DISETUJUI / MEMENUHI STANDAR"}
                    {doc.status_approval === "revisi" && "⚠ PERLU REVISI / PERBAIKAN"}
                    {doc.status_approval === "pending" && "⏱ MENUNGGU PENINJAUAN"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bagian 2: Hasil Temuan Audit */}
        <div className="print-section">
          <h3 className="section-heading">II. HASIL TEMUAN AUDIT MUTU</h3>
          
          <div className="temuan-box">
            <h4 className="temuan-subheading temuan-positif">
              A. Temuan Positif & Kesesuaian Standar Dokumen
            </h4>
            <div className="temuan-content">
              {doc.kelebihan && doc.kelebihan.trim() ? (
                <p style={{ whiteSpace: "pre-line", margin: 0 }}>{doc.kelebihan}</p>
              ) : (
                <p style={{ fontStyle: "italic", color: "#666", margin: 0 }}>
                  Dokumen telah diperiksa dan dinyatakan memenuhi kelayakan standar mutu.
                </p>
              )}
            </div>
          </div>

          <div className="temuan-box" style={{ marginTop: 14 }}>
            <h4 className="temuan-subheading temuan-revisi">
              B. Catatan Kekurangan & Rekomendasi Tindak Lanjut / Revisi
            </h4>
            <div className="temuan-content">
              {doc.kekurangan && doc.kekurangan.trim() ? (
                <p style={{ whiteSpace: "pre-line", margin: 0 }}>{doc.kekurangan}</p>
              ) : (
                <p style={{ fontStyle: "italic", color: "#666", margin: 0 }}>
                  Tidak ada catatan ketidaksesuaian mayor yang ditemukan.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bagian 3: Pengesahan & Tanda Tangan */}
        <div className="print-section signature-section">
          <div style={{ textAlign: "right", marginBottom: 20, fontSize: "0.95rem" }}>
            Magelang, {printDate}
          </div>
          <div className="signature-grid">
            <div className="signature-col">
              <p>Mengetahui,</p>
              <p>Kepala SMK Negeri 2 Magelang</p>
              <div className="signature-space" />
              <p><strong>Kurniawan Basuki, S.Pd., M.T.</strong></p>
              <p>NIP. 19700512 199702 1 004</p>
            </div>

            <div className="signature-col">
              <p>Auditor Penjaminan Mutu,</p>
              <p>Ketua TPMPS</p>
              <div className="signature-space" />
              <p><strong>{doc.nama_auditor || "Vickky Listyaningsih, M.Kom."}</strong></p>
              <p>NIP. 19820415 200801 2 011</p>
            </div>
          </div>
        </div>

        <div className="print-footer-note">
          <p>
            * Dokumen ini merupakan bukti resmi hasil verifikasi dan audit mutu dokumen internal SMK Negeri 2 Magelang.
          </p>
        </div>
      </div>
    </div>
  );
}
