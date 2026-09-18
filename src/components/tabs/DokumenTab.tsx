'use client';

import React, { useState } from 'react';
import {
  BuktiDokumen,
  UserRole,
  UserProfile,
  UnitKerja,
  StandardSNP,
  EvaluasiMutu
} from '@/types/tpmps';
import {
  FolderArchive,
  Upload,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  FileCode,
  Image,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Eye,
  Plus,
  X,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Link as LinkIcon
} from 'lucide-react';

interface DokumenTabProps {
  userRole: UserRole;
  currentUser: UserProfile;
  dokumenList: BuktiDokumen[];
  unitKerjaList: UnitKerja[];
  standarSnpList: StandardSNP[];
  evaluasiList: EvaluasiMutu[];
  onAddDokumen: (doc: BuktiDokumen) => void;
  onVerifyDokumen: (id: string, status: 'Terverifikasi' | 'Ditolak', notes?: string) => void;
}

export default function DokumenTab({
  userRole,
  currentUser,
  dokumenList,
  unitKerjaList,
  standarSnpList,
  evaluasiList,
  onAddDokumen,
  onVerifyDokumen
}: DokumenTabProps) {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedStandard, setSelectedStandard] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<BuktiDokumen | null>(null);

  // Form states for upload modal
  const [newTitle, setNewTitle] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newEvaluasiId, setNewEvaluasiId] = useState<string>(
    evaluasiList[0]?.id || 'eval-02'
  );
  const [newStandardId, setNewStandardId] = useState<number>(1);
  const [newUnitId, setNewUnitId] = useState<string>(currentUser.unitId || 'unit-kurikulum');
  const [newVersion, setNewVersion] = useState('v1.0');
  const [newIndikatorCode, setNewIndikatorCode] = useState('SKL-1.1');

  const isTPMPS = userRole === 'ketua_tpmps' || userRole === 'anggota_tpmps' || userRole === 'admin';

  // Filtered documents
  const filteredDocs = dokumenList.filter((doc) => {
    if (selectedUnit !== 'all' && doc.unitId !== selectedUnit) return false;
    if (selectedStandard !== 'all' && doc.standardId !== selectedStandard) return false;
    if (selectedStatus !== 'all' && doc.status !== selectedStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q) ||
        doc.uploadedBy.toLowerCase().includes(q) ||
        doc.unitName.toLowerCase().includes(q) ||
        doc.evaluasiId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'word':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'image':
        return <Image className="w-5 h-5 text-purple-600" />;
      default:
        return <FileCode className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetEval = evaluasiList.find((ev) => ev.id === newEvaluasiId);
    const unit = unitKerjaList.find((u) => u.id === (targetEval ? targetEval.unitId : newUnitId));

    const newDoc: BuktiDokumen = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      fileName: newFileName || `${newTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: '2.4 MB',
      fileType: 'pdf',
      evaluasiId: newEvaluasiId, // FK -> EvaluasiMutu
      standardId: targetEval ? targetEval.standardId : Number(newStandardId),
      indikatorId: targetEval ? targetEval.indikatorId : 'ind-101',
      indikatorCode: targetEval ? targetEval.indikatorCode : newIndikatorCode,
      unitId: unit ? unit.id : newUnitId,
      unitName: unit ? unit.name : 'Unit Kerja',
      version: newVersion,
      uploadedByUserId: currentUser.id,
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Menunggu Verifikasi',
      notes: 'Dokumen bukti fisik baru diunggah ke sistem.'
    };

    onAddDokumen(newDoc);
    setShowUploadModal(false);
    setNewTitle('');
    setNewFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-blue-600" />
            Bank Bukti Fisik & Dokumen Mutu Terintegrasi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Seluruh berkas bukti fisik terhubung langsung ke catatan Evaluasi Mutu (*Foreign Key: evaluasi_id*) dan unit pelaksana.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Unggah Dokumen Bukti
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, berkas, atau evaluasi..."
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Unit Filter */}
        <div>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Unit Kerja ({unitKerjaList.length})</option>
            {unitKerjaList.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Standard SNP Filter */}
        <div>
          <select
            value={selectedStandard}
            onChange={(e) =>
              setSelectedStandard(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Standar SNP (8)</option>
            {standarSnpList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Verification Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Status Verifikasi</option>
            <option value="Terverifikasi">Terverifikasi (Valid)</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Ditolak">Ditolak / Revisi</option>
          </select>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const linkedEval = evaluasiList.find((ev) => ev.id === doc.evaluasiId);
          return (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:scale-105 transition">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      doc.status === 'Terverifikasi'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : doc.status === 'Ditolak'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {doc.title}
                </h3>

                {/* Foreign Key Link Box */}
                <div className="mt-2.5 p-2 bg-blue-50/60 rounded-lg border border-blue-100 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-blue-800 font-semibold flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-blue-500" />
                    FK: {doc.evaluasiId}
                  </span>
                  <span className="text-blue-700 font-medium">
                    {linkedEval ? linkedEval.indikatorCode : doc.indikatorCode}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-600 truncate max-w-[180px]">
                      {doc.fileName}
                    </span>
                    <span className="font-mono text-slate-400">{doc.fileSize}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-700 font-medium">{doc.unitName}</span>
                    <span className="bg-slate-100 px-1.5 py-0.2 rounded font-mono text-[10px]">
                      {doc.version}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{doc.uploadedAt.split(' ')[0]}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Detail
                  </button>
                  <button
                    onClick={() => alert(`Mengunduh file: ${doc.fileName}`)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Unduh Berkas"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Unggah Dokumen Baru Terikat Relasional */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  Unggah Bukti Dokumen Mutu
                </h3>
                <span className="text-[10px] text-blue-600 font-medium">
                  Tautkan berkas ke catatan Evaluasi Mutu
                </span>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 mt-4 text-xs">
              {/* Target Evaluation Selector */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pilih Catatan Evaluasi Mutu yang Dibuktikan (Foreign Key: evaluasi_id):
                </label>
                <select
                  value={newEvaluasiId}
                  onChange={(e) => {
                    setNewEvaluasiId(e.target.value);
                    const target = evaluasiList.find((ev) => ev.id === e.target.value);
                    if (target) {
                      setNewStandardId(target.standardId);
                      setNewUnitId(target.unitId);
                      setNewIndikatorCode(target.indikatorCode);
                    }
                  }}
                  className="w-full p-2 border border-blue-200 bg-blue-50/50 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {evaluasiList.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      [{ev.id}] {ev.indikatorCode} - {ev.unitName} ({ev.periode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center bg-slate-50 transition">
                <Upload className="w-6 h-6 text-blue-500 mx-auto mb-1.5" />
                <p className="font-bold text-slate-700">Tarik & Lepaskan File Bukti Di Sini</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Mendukung PDF, Excel (.xlsx), Word (.docx), atau Gambar (Maks 20MB)
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewFileName(e.target.files[0].name);
                      if (!newTitle) setNewTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block mt-2 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg cursor-pointer text-xs"
                >
                  Pilih Berkas dari Komputer
                </label>
                {newFileName && (
                  <p className="mt-1.5 text-xs font-bold text-emerald-600">✓ Berkas: {newFileName}</p>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Judul Dokumen Bukti</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: MoU Kerjasama IDUKA PT Telkom 2025"
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit Pengunggah</label>
                  <select
                    value={newUnitId}
                    onChange={(e) => setNewUnitId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {unitKerjaList.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Versi Dokumen</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-xs"
                >
                  Simpan & Tautkan ke Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail / Preview Dokumen */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {previewDoc.indikatorCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 my-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Relasi Evaluasi (FK):</span>
                  <span className="font-mono text-blue-700 font-bold">
                    {previewDoc.evaluasiId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama File:</span>
                  <span className="font-semibold text-slate-800">{previewDoc.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ukuran:</span>
                  <span className="font-mono text-slate-700">{previewDoc.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unit Pengunggah:</span>
                  <span className="font-semibold text-slate-800">{previewDoc.unitName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Diupload Oleh:</span>
                  <span className="text-slate-800">{previewDoc.uploadedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu:</span>
                  <span className="text-slate-700">{previewDoc.uploadedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Versi:</span>
                  <span className="font-mono bg-slate-200 px-1 rounded">{previewDoc.version}</span>
                </div>
              </div>

              {previewDoc.notes && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Catatan Dokumen:</span>
                  <p className="p-2.5 bg-blue-50/50 text-blue-900 rounded-xl border border-blue-100">
                    {previewDoc.notes}
                  </p>
                </div>
              )}

              {previewDoc.verifiedBy && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Diverifikasi sah oleh: <strong>{previewDoc.verifiedBy}</strong></span>
                </div>
              )}
            </div>

            {/* Actions for TPMPS Auditor */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => alert(`Mengunduh berkas: ${previewDoc.fileName}`)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Dokumen
              </button>

              {isTPMPS && previewDoc.status === 'Menunggu Verifikasi' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onVerifyDokumen(previewDoc.id, 'Ditolak', 'Dokumen belum lengkap');
                      setPreviewDoc(null);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => {
                      onVerifyDokumen(previewDoc.id, 'Terverifikasi');
                      setPreviewDoc(null);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sahkan Verifikasi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
