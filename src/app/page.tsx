'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar, { TabType } from '@/components/Sidebar';
import RoleBanner from '@/components/RoleBanner';
import DashboardTab from '@/components/tabs/DashboardTab';
import IndikatorTab from '@/components/tabs/IndikatorTab';
import EvaluasiTab from '@/components/tabs/EvaluasiTab';
import DokumenTab from '@/components/tabs/DokumenTab';
import ProgramRtlTab from '@/components/tabs/ProgramRtlTab';
import LaporanTab from '@/components/tabs/LaporanTab';
import AuditLogTab from '@/components/tabs/AuditLogTab';
import UserManagementTab from '@/components/tabs/UserManagementTab';
import RelasiDataTab from '@/components/tabs/RelasiDataTab';
import { AppDatabaseState } from '@/lib/relationalHelpers';

import {
  UserRole,
  UserProfile,
  UnitKerja,
  StandardSNP,
  IndikatorMutu,
  EvaluasiMutu,
  BuktiDokumen,
  ProgramMutuRTL,
  AuditLogItem
} from '@/types/tpmps';

import {
  DEMO_USERS,
  UNIT_KERJA_LIST,
  STANDAR_SNP_LIST,
  INDIKATOR_MUTU_LIST,
  EVALUASI_MUTU_LIST,
  BUKTI_DOKUMEN_LIST,
  PROGRAM_MUTU_RTL_LIST,
  AUDIT_LOGS_LIST
} from '@/data/mockData';

import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [activeRole, setActiveRole] = useState<UserRole>('kepala_sekolah');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedPeriode, setSelectedPeriode] = useState<string>('Semester Ganjil 2025/2026');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // App Data States
  const [unitKerjaList, setUnitKerjaList] = useState<UnitKerja[]>(UNIT_KERJA_LIST);
  const [standarSnpList, setStandarSnpList] = useState<StandardSNP[]>(STANDAR_SNP_LIST);
  const [indikatorList, setIndikatorList] = useState<IndikatorMutu[]>(INDIKATOR_MUTU_LIST);
  const [evaluasiList, setEvaluasiList] = useState<EvaluasiMutu[]>(EVALUASI_MUTU_LIST);
  const [dokumenList, setDokumenList] = useState<BuktiDokumen[]>(BUKTI_DOKUMEN_LIST);
  const [programRtlList, setProgramRtlList] = useState<ProgramMutuRTL[]>(PROGRAM_MUTU_RTL_LIST);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(AUDIT_LOGS_LIST);

  // Toast Feedback state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Current active user object based on activeRole
  const currentUser: UserProfile =
    DEMO_USERS[activeRole] || DEMO_USERS['kepala_sekolah'];

  // Handle role change
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    showToast(`Beralih ke mode peran: ${role.replace('_', ' ').toUpperCase()}`, 'info');

    // If switching to Guru, redirect from managerial tab to Dokumen or Indikator
    if (role === 'guru' && (activeTab === 'dashboard' || activeTab === 'evaluasi' || activeTab === 'laporan')) {
      setActiveTab('dokumen');
    }
  };

  // Update Evaluation workflow
  const handleUpdateEvaluasi = (updated: EvaluasiMutu) => {
    setEvaluasiList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );

    // If score verifikasi changed, update corresponding SNP currentScore
    if (updated.nilaiVerifikasi !== undefined) {
      setStandarSnpList((prev) =>
        prev.map((snp) => {
          if (snp.id === updated.standardId) {
            // slightly adjust score
            const diff = (updated.nilaiVerifikasi! - snp.currentScore) * 0.1;
            const newScore = Number((snp.currentScore + diff).toFixed(1));
            return { ...snp, currentScore: Math.min(100, Math.max(0, newScore)) };
          }
          return snp;
        })
      );
    }

    // Add audit log
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: updated.status === 'Disetujui' ? 'APPROVAL_EVALUASI' : 'UPDATE_EVALUASI',
      entity: 'Evaluasi Mutu',
      entityId: updated.id,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.22',
      details: `${currentUser.name} mengubah status ${updated.indikatorCode} menjadi ${updated.status} (Nilai: ${updated.nilaiVerifikasi ?? updated.nilaiMandiri}%)`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Status evaluasi ${updated.indikatorCode} berhasil diperbarui menjadi ${updated.status}!`);
  };

  // Add Document
  const handleAddDokumen = (newDoc: BuktiDokumen) => {
    setDokumenList((prev) => [newDoc, ...prev]);

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'UPLOAD_DOKUMEN',
      entity: 'Bukti Dokumen',
      entityId: newDoc.id,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.35',
      details: `${currentUser.name} mengunggah berkas bukti baru: "${newDoc.title}"`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Dokumen "${newDoc.title}" berhasil diunggah!`);
  };

  // Verify Document
  const handleVerifyDokumen = (id: string, status: 'Terverifikasi' | 'Ditolak', notes?: string) => {
    setDokumenList((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status,
              verifiedBy: currentUser.name,
              notes: notes || doc.notes
            }
          : doc
      )
    );

    const targetDoc = dokumenList.find((d) => d.id === id);
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'VERIFIKASI_DOKUMEN',
      entity: 'Bukti Dokumen',
      entityId: id,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.15',
      details: `${currentUser.name} mengubah verifikasi dokumen "${targetDoc?.title || id}" menjadi ${status}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Dokumen berhasil ditandai: ${status}!`);
  };

  // Update Program RTL
  const handleUpdateProgram = (updated: ProgramMutuRTL) => {
    setProgramRtlList((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'UPDATE_RTL',
      entity: 'Program RTL',
      entityId: updated.id,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.12',
      details: `${currentUser.name} memperbarui progres RTL "${updated.title}" menjadi ${updated.progress}% (${updated.status})`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Progres program RTL berhasil diperbarui!`);
  };

  // Add Program RTL
  const handleAddProgram = (newProg: ProgramMutuRTL) => {
    setProgramRtlList((prev) => [newProg, ...prev]);

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'CREATE_RTL',
      entity: 'Program RTL',
      entityId: newProg.id,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.12',
      details: `${currentUser.name} menambahkan rencana tindak lanjut mutu baru: "${newProg.title}"`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Program RTL "${newProg.title}" berhasil didaftarkan!`);
  };

  // Badges count
  const evaluasiReviewCount = evaluasiList.filter(
    (e) => e.status === 'Diajukan' || e.status === 'Direview'
  ).length;
  const dokumenPendingCount = dokumenList.filter(
    (d) => d.status === 'Menunggu Verifikasi'
  ).length;
  const rtlAktifCount = programRtlList.filter(
    (p) => p.status === 'Sedang Berjalan'
  ).length;

  const appDatabaseState: AppDatabaseState = {
    users: Object.values(DEMO_USERS),
    unitKerjaList,
    standarSnpList,
    indikatorList,
    evaluasiList,
    dokumenList,
    programRtlList,
    auditLogs
  };

  const handleCreateRtlFromEval = (evaluasi: EvaluasiMutu) => {
    setActiveTab('program_rtl');
    showToast(`Membuka form RTL terhubung untuk temuan evaluasi [${evaluasi.indikatorCode}]`, 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userRole={activeRole}
        counts={{
          evaluasiReview: evaluasiReviewCount,
          dokumenPending: dokumenPendingCount,
          rtlAktif: rtlAktifCount
        }}
      />

      {/* Main Content Area (offset by sidebar width on lg screens) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          selectedPeriode={selectedPeriode}
          onPeriodeChange={setSelectedPeriode}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Interactive Role Switcher Banner */}
          <div className="no-print">
            <RoleBanner
              currentRole={activeRole}
              onRoleChange={handleRoleChange}
            />
          </div>

          {/* Toast Notification */}
          {toast && (
            <div className="fixed bottom-6 right-6 z-50 bg-white text-slate-900 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-200 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          )}

          {/* Active Tab View */}
          {activeTab === 'dashboard' && (
            <DashboardTab
              userRole={activeRole}
              unitKerjaList={unitKerjaList}
              standarSnpList={standarSnpList}
              evaluasiList={evaluasiList}
              programRtlList={programRtlList}
              auditLogs={auditLogs}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'indikator' && (
            <IndikatorTab
              userRole={activeRole}
              standarSnpList={standarSnpList}
              indikatorList={indikatorList}
              unitKerjaList={unitKerjaList}
            />
          )}

          {activeTab === 'evaluasi' && (
            <EvaluasiTab
              userRole={activeRole}
              currentUser={currentUser}
              evaluasiList={evaluasiList}
              unitKerjaList={unitKerjaList}
              standarSnpList={standarSnpList}
              dokumenList={dokumenList}
              programRtlList={programRtlList}
              onUpdateEvaluasi={handleUpdateEvaluasi}
              onCreateRtlFromEval={handleCreateRtlFromEval}
            />
          )}

          {activeTab === 'dokumen' && (
            <DokumenTab
              userRole={activeRole}
              currentUser={currentUser}
              dokumenList={dokumenList}
              unitKerjaList={unitKerjaList}
              standarSnpList={standarSnpList}
              evaluasiList={evaluasiList}
              onAddDokumen={handleAddDokumen}
              onVerifyDokumen={handleVerifyDokumen}
            />
          )}

          {activeTab === 'program_rtl' && (
            <ProgramRtlTab
              userRole={activeRole}
              currentUser={currentUser}
              programList={programRtlList}
              unitKerjaList={unitKerjaList}
              standarSnpList={standarSnpList}
              evaluasiList={evaluasiList}
              onUpdateProgram={handleUpdateProgram}
              onAddProgram={handleAddProgram}
            />
          )}

          {activeTab === 'laporan' && (
            <LaporanTab
              userRole={activeRole}
              selectedPeriode={selectedPeriode}
              unitKerjaList={unitKerjaList}
              standarSnpList={standarSnpList}
              evaluasiList={evaluasiList}
              programRtlList={programRtlList}
            />
          )}

          {activeTab === 'relasi' && (
            <RelasiDataTab
              userRole={activeRole}
              state={appDatabaseState}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'audit_log' && (
            <AuditLogTab
              userRole={activeRole}
              auditLogs={auditLogs}
            />
          )}

          {activeTab === 'user_management' && (
            <UserManagementTab
              userRole={activeRole}
              unitKerjaList={unitKerjaList}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="no-print mt-auto border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              © 2026 <strong>SIGMA-TPMPS SMK</strong> • Tim Penjaminan Mutu Pendidikan Sekolah
            </span>
            <span className="text-[11px] text-slate-400">
              Siklus PPEPP: Penetapan • Pelaksanaan • Evaluasi • Pengendalian • Peningkatan
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
