import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertTriangle, Clock, ShieldCheck, Save } from "lucide-react";
import { api } from "./client";
import type { DocumentItem, Profile, ApprovalStatus } from "./domain";

interface AuditModalProps {
  doc: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  currentProfile: Profile | null;
  report: (msg: string) => void;
}

export function AuditModal({
  doc,
  isOpen,
  onClose,
  onSaved,
  currentProfile,
  report,
}: AuditModalProps) {
  const [status, setStatus] = useState<ApprovalStatus>("approved");
  const [kelebihan, setKelebihan] = useState("");
  const [kekurangan, setKekurangan] = useState("");
  const [auditorName, setAuditorName] = useState("");
  const [tanggalAudit, setTanggalAudit] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (doc) {
      setStatus(doc.status_approval === "pending" ? "approved" : doc.status_approval);
      setKelebihan(doc.kelebihan || "");
      setKekurangan(doc.kekurangan || "");
      setAuditorName(doc.nama_auditor || currentProfile?.full_name || "Vickky Listyaningsih, M.Kom.");
      setTanggalAudit(
        doc.tanggal_audit
          ? doc.tanggal_audit.split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setError("");
    }
  }, [doc, currentProfile]);

  if (!isOpen || !doc) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!doc) return;
    setBusy(true);
    setError("");

    try {
      await api("audits", {
        document_id: doc.id,
        status_approval: status,
        kelebihan,
        kekurangan,
        nama_auditor: auditorName.trim() || currentProfile?.full_name || "Ketua TPMPS",
        tanggal_audit: tanggalAudit,
      });

      report(`Audit untuk dokumen "${doc.nama_dokumen}" berhasil disimpan.`);
      await onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan hasil audit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card audit-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640, width: "95%" }}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 600 }}>
                Form Audit & Approval Dokumen
              </h3>
              <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>
                Tim Penjaminan Mutu Pendidikan Sekolah (TPMPS)
              </span>
            </div>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Tutup form audit"
            style={{ padding: 6 }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="notice-banner" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", margin: "12px 20px 0" }}>
            {error}
          </div>
        )}

        <div className="audit-doc-info" style={{ margin: "16px 20px 0", padding: "12px 16px", background: "var(--card-bg, rgba(255,255,255,0.04))", borderRadius: 8, border: "1px solid var(--border-color, rgba(255,255,255,0.1))" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", fontSize: "0.85rem" }}>
            <div>
              <span style={{ opacity: 0.65 }}>Nomor Dokumen:</span>
              <div style={{ fontWeight: 600, color: "var(--primary-color, #38bdf8)" }}>{doc.nomor_dokumen}</div>
            </div>
            <div>
              <span style={{ opacity: 0.65 }}>Unit / Jurusan:</span>
              <div style={{ fontWeight: 600 }}>{doc.unit}</div>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <span style={{ opacity: 0.65 }}>Nama Dokumen:</span>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{doc.nama_dokumen}</div>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <span style={{ opacity: 0.65 }}>Letak Penyimpanan Dokumen:</span>
              <div style={{ fontWeight: 500 }}>📍 {doc.letak_dokumen}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "16px 20px 20px" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 8 }}>
              Keputusan Status Approval <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <button
                type="button"
                className={`approval-toggle-btn ${status === "approved" ? "active-approved" : ""}`}
                onClick={() => setStatus("approved")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  border: status === "approved" ? "2px solid #10b981" : "1px solid var(--border-color, rgba(255,255,255,0.15))",
                  background: status === "approved" ? "rgba(16, 185, 129, 0.15)" : "transparent",
                  color: status === "approved" ? "#10b981" : "inherit",
                }}
              >
                <CheckCircle2 size={16} /> Disetujui
              </button>

              <button
                type="button"
                className={`approval-toggle-btn ${status === "revisi" ? "active-revisi" : ""}`}
                onClick={() => setStatus("revisi")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  border: status === "revisi" ? "2px solid #ef4444" : "1px solid var(--border-color, rgba(255,255,255,0.15))",
                  background: status === "revisi" ? "rgba(239, 68, 68, 0.15)" : "transparent",
                  color: status === "revisi" ? "#ef4444" : "inherit",
                }}
              >
                <AlertTriangle size={16} /> Perlu Revisi
              </button>

              <button
                type="button"
                className={`approval-toggle-btn ${status === "pending" ? "active-pending" : ""}`}
                onClick={() => setStatus("pending")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  border: status === "pending" ? "2px solid #f59e0b" : "1px solid var(--border-color, rgba(255,255,255,0.15))",
                  background: status === "pending" ? "rgba(245, 158, 11, 0.15)" : "transparent",
                  color: status === "pending" ? "#f59e0b" : "inherit",
                }}
              >
                <Clock size={16} /> Pending
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 6 }}>
              Temuan Positif / Kelebihan Dokumen
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan poin-poin kesesuaian atau kelebihan dari dokumen yang telah diperiksa..."
              value={kelebihan}
              onChange={(e) => setKelebihan(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                background: "var(--input-bg, rgba(255,255,255,0.06))",
                border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
                color: "inherit",
                fontSize: "0.88rem",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 6 }}>
              Temuan Kekurangan / Catatan Rekomendasi Revisi
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan catatan perbaikan atau hal-hal yang perlu direvisi oleh unit bersangkutan..."
              value={kekurangan}
              onChange={(e) => setKekurangan(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                background: "var(--input-bg, rgba(255,255,255,0.06))",
                border: "1px solid var(--border-color, rgba(255,255,255,0.15))",
                color: "inherit",
                fontSize: "0.88rem",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 6 }}>
                Nama Auditor / Ketua TPMPS <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                required
                value={auditorName}
                onChange={(e) => setAuditorName(e.target.value)}
                placeholder="Nama Auditor"
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

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 6 }}>
                Tanggal Audit <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="date"
                required
                value={tanggalAudit}
                onChange={(e) => setTanggalAudit(e.target.value)}
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
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              className="button-ghost"
              onClick={onClose}
              disabled={busy}
              style={{ padding: "10px 18px", borderRadius: 8, cursor: "pointer" }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={busy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 8,
                cursor: "pointer",
                background: "#0284c7",
                color: "#ffffff",
                fontWeight: 600,
                border: "none",
              }}
            >
              <Save size={16} />
              {busy ? "Menyimpan..." : "Simpan Keputusan Audit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
