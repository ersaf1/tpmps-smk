import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  MapPin,
  X,
  Trash2,
  Edit2,
  Save,
  RefreshCw,
} from "lucide-react";
import { api, allRows, db } from "./client";
import type { DocumentItem, Profile, Unit, ApprovalStatus } from "./domain";
import { AuditModal } from "./AuditModal";
import { AuditPrintView } from "./AuditPrintView";

interface DocumentDirectoryProps {
  currentProfile: Profile | null;
  units: Unit[];
  report: (msg: string) => void;
  onOpenFileViewer?: (fileId: string) => void;
}

export function DocumentDirectory({
  currentProfile,
  units,
  report,
  onOpenFileViewer,
}: DocumentDirectoryProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // State untuk Modal Tambah/Edit Dokumen
  const [editDoc, setEditDoc] = useState<DocumentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formBusy, setFormBusy] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Fields untuk Tambah/Edit
  const [nomorDokumen, setNomorDokumen] = useState("");
  const [namaDokumen, setNamaDokumen] = useState("");
  const [formUnit, setFormUnit] = useState("");
  const [formUnitId, setFormUnitId] = useState("");
  const [letakDokumen, setLetakDokumen] = useState("");
  const [filePath, setFilePath] = useState("");

  // State untuk Modal Audit Dokumen
  const [auditDoc, setAuditDoc] = useState<DocumentItem | null>(null);

  // State untuk Halaman Cetak Laporan
  const [printDoc, setPrintDoc] = useState<DocumentItem | null>(null);

  const isAuditorOrAdmin =
    currentProfile?.role === "superadmin" || currentProfile?.role === "ketua_tpmps";

  async function fetchDocuments() {
    setLoading(true);
    setError("");
    try {
      // Mengambil dari view v_document_directory via db PostgREST atau API fallback
      const { data, error: dbErr } = await db
        .from("v_document_directory")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbErr) {
        // Fallback panggil API endpoint backend
        const res = await api("documents", undefined, "GET");
        setDocuments(res);
      } else {
        setDocuments(data || []);
      }
    } catch (err) {
      console.error("Error loading documents:", err);
      // Fallback API call
      try {
        const res = await api("documents", undefined, "GET");
        setDocuments(res);
      } catch (apiErr) {
        setError(apiErr instanceof Error ? apiErr.message : "Gagal memuat direktori dokumen.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter Dokumen berdasarkan Search Bar, Unit, dan Status
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        doc.nama_dokumen.toLowerCase().includes(q) ||
        doc.nomor_dokumen.toLowerCase().includes(q) ||
        doc.letak_dokumen.toLowerCase().includes(q) ||
        doc.unit.toLowerCase().includes(q);

      const matchUnit =
        selectedUnit === "all" ||
        doc.unit === selectedUnit ||
        doc.unit_id === selectedUnit;

      const matchStatus =
        selectedStatus === "all" || doc.status_approval === selectedStatus;

      return matchSearch && matchUnit && matchStatus;
    });
  }, [documents, search, selectedUnit, selectedStatus]);

  function openAddModal() {
    setEditDoc(null);
    setNomorDokumen("");
    setNamaDokumen("");
    // Default unit sesuai profil kepala unit jika ada
    const defaultUnit =
      currentProfile?.unit_id && units.find((u) => u.id === currentProfile.unit_id);
    setFormUnit(defaultUnit ? defaultUnit.name : units[0]?.name || "Kurikulum");
    setFormUnitId(defaultUnit ? defaultUnit.id : units[0]?.id || "");
    setLetakDokumen("");
    setFilePath("");
    setFormError("");
    setIsAddModalOpen(true);
  }

  function openEditModal(doc: DocumentItem) {
    setEditDoc(doc);
    setNomorDokumen(doc.nomor_dokumen);
    setNamaDokumen(doc.nama_dokumen);
    setFormUnit(doc.unit);
    setFormUnitId(doc.unit_id || "");
    setLetakDokumen(doc.letak_dokumen);
    setFilePath(doc.file_path || "");
    setFormError("");
    setIsAddModalOpen(true);
  }

  async function handleSaveDocument(e: React.FormEvent) {
    e.preventDefault();
    setFormBusy(true);
    setFormError("");

    try {
      const payload = {
        nomor_dokumen: nomorDokumen.trim(),
        nama_dokumen: namaDokumen.trim(),
        unit: formUnit.trim(),
        unit_id: formUnitId || null,
        letak_dokumen: letakDokumen.trim(),
        file_path: filePath.trim() || null,
      };

      if (editDoc) {
        await api(`documents/${editDoc.id}`, payload, "PUT");
        report(`Dokumen "${namaDokumen}" berhasil diperbarui.`);
      } else {
        await api("documents", payload, "POST");
        report(`Dokumen "${namaDokumen}" berhasil ditambahkan ke direktori.`);
      }

      setIsAddModalOpen(false);
      await fetchDocuments();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan data dokumen.");
    } finally {
      setFormBusy(false);
    }
  }

  async function handleDeleteDocument(doc: DocumentItem) {
    if (!window.confirm(`Yakin ingin menghapus dokumen "${doc.nama_dokumen}" dari direktori?`)) {
      return;
    }

    try {
      await api(`documents/${doc.id}`, undefined, "DELETE");
      report(`Dokumen "${doc.nama_dokumen}" telah dihapus.`);
      await fetchDocuments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus dokumen.");
    }
  }

  // Jika sedang mencetak laporan, tampilkan halaman cetak
  if (printDoc) {
    return (
      <AuditPrintView
        doc={printDoc}
        onBack={() => setPrintDoc(null)}
      />
    );
  }

  return (
    <div className="directory-page-container">
      {/* Header Halaman Direktori */}
      <div className="directory-header">
        <div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <MapPin className="text-primary" size={24} />
            Direktori & Letak Dokumen Mutu Sekolah
          </h2>
          <p style={{ margin: "4px 0 0", opacity: 0.75, fontSize: "0.88rem" }}>
            Lacak lokasi penyimpanan fisik (lemari/rak arsip) serta salinan digital dokumen seluruh unit kerja.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="button-ghost icon-button"
            onClick={fetchDocuments}
            title="Segarkan data"
            aria-label="Segarkan data"
          >
            <RefreshCw size={17} className={loading ? "spin" : ""} />
          </button>

          <button
            className="button-primary"
            onClick={openAddModal}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              borderRadius: 8,
              background: "#0284c7",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.88rem",
            }}
          >
            <Plus size={18} />
            Tambah Dokumen
          </button>
        </div>
      </div>

      {error && (
        <div className="notice-banner" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Bar Pencarian & Filter */}
      <div className="directory-filter-bar">
        {/* Search Bar Real-Time */}
        <div className="search-box-container" style={{ flex: 1, position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.6 }} />
          <input
            type="text"
            placeholder="Cari nama dokumen, kode/nomor, unit, atau lokasi lemari arsip..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              borderRadius: 8,
              border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
              background: "var(--input-bg, rgba(255,255,255,0.05))",
              color: "inherit",
              fontSize: "0.88rem",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", opacity: 0.6 }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Dropdown Unit */}
        <div style={{ minWidth: 180 }}>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            aria-label="Filter berdasarkan Unit"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
              background: "var(--input-bg, rgba(255,255,255,0.05))",
              color: "inherit",
              fontSize: "0.88rem",
            }}
          >
            <option value="all">Semua Unit Kerja</option>
            {units.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Dropdown Status Audit */}
        <div style={{ minWidth: 160 }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter berdasarkan Status Audit"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
              background: "var(--input-bg, rgba(255,255,255,0.05))",
              color: "inherit",
              fontSize: "0.88rem",
            }}
          >
            <option value="all">Semua Status Audit</option>
            <option value="approved">Disetujui</option>
            <option value="revisi">Perlu Revisi</option>
            <option value="pending">Belum / Pending</option>
          </select>
        </div>
      </div>

      {/* Tabel Data Responsif */}
      <div className="directory-table-card">
        {loading ? (
          <div style={{ padding: "40px 20px", textAlign: "center", opacity: 0.6 }}>
            <RefreshCw size={24} className="spin" style={{ margin: "0 auto 10px" }} />
            <p>Memuat data direktori dokumen...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", opacity: 0.6 }}>
            <FileText size={32} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>Tidak ada dokumen yang ditemukan</p>
            <p style={{ fontSize: "0.85rem" }}>
              {search || selectedUnit !== "all" || selectedStatus !== "all"
                ? "Coba ubah kata kunci pencarian atau sesuaikan filter dropdown."
                : "Klik tombol '+ Tambah Dokumen' untuk mendaftarkan dokumen pertama."}
            </p>
          </div>
        ) : (
          <div className="table-responsive" style={{ overflowX: "auto" }}>
            <table className="custom-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border-color, rgba(255,255,255,0.1))" }}>
                  <th style={{ padding: "12px 14px", width: 50 }}>No</th>
                  <th style={{ padding: "12px 14px", width: 140 }}>Nomor Dokumen</th>
                  <th style={{ padding: "12px 14px" }}>Nama Dokumen</th>
                  <th style={{ padding: "12px 14px", width: 160 }}>Unit Kerja</th>
                  <th style={{ padding: "12px 14px" }}>Letak Penyimpanan</th>
                  <th style={{ padding: "12px 14px", width: 130 }}>Status Audit</th>
                  <th style={{ padding: "12px 14px", width: 220, textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc, idx) => (
                  <tr
                    key={doc.id}
                    style={{
                      borderBottom: "1px solid var(--border-color, rgba(255,255,255,0.06))",
                      transition: "background 0.15s ease",
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: "12px 14px", opacity: 0.7 }}>{idx + 1}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          background: "var(--badge-bg, rgba(56, 189, 248, 0.12))",
                          color: "var(--primary-color, #38bdf8)",
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          fontFamily: "monospace",
                        }}
                      >
                        {doc.nomor_dokumen}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>
                      {doc.nama_dokumen}
                      {doc.file_path && (
                        <div style={{ fontSize: "0.78rem", opacity: 0.6, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                          <ExternalLink size={12} /> Salinan digital tersedia
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>{doc.unit}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.88rem" }}>
                        <MapPin size={15} style={{ color: "#f59e0b", flexShrink: 0 }} />
                        <span>{doc.letak_dokumen}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {doc.status_approval === "approved" && (
                        <span className="badge badge-approved" style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "4px 8px", borderRadius: 6, fontSize: "0.78rem", fontWeight: 600 }}>
                          <CheckCircle2 size={13} /> Disetujui
                        </span>
                      )}
                      {doc.status_approval === "revisi" && (
                        <span className="badge badge-revisi" style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(239,68,68,0.15)", color: "#ef4444", padding: "4px 8px", borderRadius: 6, fontSize: "0.78rem", fontWeight: 600 }}>
                          <AlertTriangle size={13} /> Revisi
                        </span>
                      )}
                      {doc.status_approval === "pending" && (
                        <span className="badge badge-pending" style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(245,158,11,0.15)", color: "#f59e0b", padding: "4px 8px", borderRadius: 6, fontSize: "0.78rem", fontWeight: 600 }}>
                          <Clock size={13} /> Pending
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        {/* Tombol Lihat File (jika ada) */}
                        {doc.file_path && (
                          <a
                            href={doc.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-button"
                            title="Buka / Unduh File"
                            aria-label="Buka / Unduh File"
                            style={{ color: "#38bdf8", padding: 6 }}
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}

                        {/* Tombol Audit Dokumen (Khusus Ketua TPMPS & Superadmin) */}
                        {isAuditorOrAdmin && (
                          <button
                            className="button-ghost icon-button"
                            onClick={() => setAuditDoc(doc)}
                            title="Audit & Beri Approval Dokumen"
                            aria-label="Audit & Beri Approval Dokumen"
                            style={{ color: "#10b981", padding: 6 }}
                          >
                            <ShieldCheck size={16} />
                          </button>
                        )}

                        {/* Tombol Cetak Laporan Audit */}
                        <button
                          className="button-ghost icon-button"
                          onClick={() => setPrintDoc(doc)}
                          title="Cetak Laporan Audit"
                          aria-label="Cetak Laporan Audit"
                          style={{ color: "#f59e0b", padding: 6 }}
                        >
                          <Printer size={16} />
                        </button>

                        {/* Tombol Edit */}
                        {isAuditorOrAdmin && (
                          <button
                            className="button-ghost icon-button"
                            onClick={() => openEditModal(doc)}
                            title="Edit Data Dokumen"
                            aria-label="Edit Data Dokumen"
                            style={{ padding: 6 }}
                          >
                            <Edit2 size={15} />
                          </button>
                        )}

                        {/* Tombol Hapus */}
                        {isAuditorOrAdmin && (
                          <button
                            className="button-ghost icon-button"
                            onClick={() => handleDeleteDocument(doc)}
                            title="Hapus Dokumen"
                            aria-label="Hapus Dokumen"
                            style={{ color: "#ef4444", padding: 6 }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit Dokumen */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 540, width: "95%" }}
          >
            <div className="modal-header">
              <h3 style={{ margin: 0, fontWeight: 600 }}>
                {editDoc ? "Edit Data Dokumen & Letak" : "Tambah Dokumen ke Direktori"}
              </h3>
              <button
                className="icon-button"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Tutup form"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="notice-banner" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", margin: "12px 20px 0" }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveDocument} style={{ padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 6 }}>
                  Nomor / Kode Dokumen <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: KUR/2026/01 atau SOP-04"
                  value={nomorDokumen}
                  onChange={(e) => setNomorDokumen(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "var(--input-bg, rgba(255,255,255,0.06))",
                    border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
                    color: "inherit",
                    fontSize: "0.88rem",
                  }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 6 }}>
                  Nama Dokumen <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Data Nilai Siswa TA 2025/2026"
                  value={namaDokumen}
                  onChange={(e) => setNamaDokumen(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "var(--input-bg, rgba(255,255,255,0.06))",
                    border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
                    color: "inherit",
                    fontSize: "0.88rem",
                  }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 6 }}>
                  Unit / Jurusan Pemilik <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={formUnitId || formUnit}
                  onChange={(e) => {
                    const u = units.find((x) => x.id === e.target.value || x.name === e.target.value);
                    if (u) {
                      setFormUnitId(u.id);
                      setFormUnit(u.name);
                    } else {
                      setFormUnit(e.target.value);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "var(--input-bg, rgba(255,255,255,0.06))",
                    border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
                    color: "inherit",
                    fontSize: "0.88rem",
                  }}
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 6 }}>
                  Letak Penyimpanan Dokumen <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lemari Arsip B - Rak 02 / Map Bantex Biru No. 5"
                  value={letakDokumen}
                  onChange={(e) => setLetakDokumen(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "var(--input-bg, rgba(255,255,255,0.06))",
                    border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
                    color: "inherit",
                    fontSize: "0.88rem",
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 6 }}>
                  Link / Salinan Berkas Digital (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://... atau link storage arsip dokumen"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "var(--input-bg, rgba(255,255,255,0.06))",
                    border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
                    color: "inherit",
                    fontSize: "0.88rem",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  className="button-ghost"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={formBusy}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="button-primary"
                  disabled={formBusy}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 20px",
                    borderRadius: 8,
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: 600,
                  }}
                >
                  <Save size={16} />
                  {formBusy ? "Menyimpan..." : "Simpan Dokumen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Audit Dokumen */}
      <AuditModal
        doc={auditDoc}
        isOpen={!!auditDoc}
        onClose={() => setAuditDoc(null)}
        onSaved={fetchDocuments}
        currentProfile={currentProfile}
        report={report}
      />
    </div>
  );
}
