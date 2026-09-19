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
import LemariTab from '@/components/tabs/LemariTab';
import LoginModal from '@/components/LoginModal';
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
  AuditLogItem,
  LemariUnit,
  LaciUnit,
  BerkasLaci
} from '@/types/tpmps';

import {
  DEMO_USERS,
  UNIT_KERJA_LIST,
  STANDAR_SNP_LIST,
  INDIKATOR_MUTU_LIST,
  EVALUASI_MUTU_LIST,
  BUKTI_DOKUMEN_LIST,
  PROGRAM_MUTU_RTL_LIST,
  AUDIT_LOGS_LIST,
  INITIAL_LEMARI_LIST,
  INITIAL_LACI_LIST
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

  // Lemari & Laci 18 Unit States
  const [lemariList, setLemariList] = useState<LemariUnit[]>(INITIAL_LEMARI_LIST);
  const [laciList, setLaciList] = useState<LaciUnit[]>(INITIAL_LACI_LIST);

  // Toast Feedback state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Login Modal & Logged-in User States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedUser, setLoggedUser] = useState<UserProfile | null>(null);

  // Impersonation State for Super Admin (Simulasi sebagai Unit Tertentu)
  const [impersonatedUnit, setImpersonatedUnit] = useState<UnitKerja | null>(null);

  // Current active user object based on loggedUser, activeRole & impersonation
  const baseUser: UserProfile =
    loggedUser || DEMO_USERS[activeRole] || DEMO_USERS['kepala_sekolah'];

  const currentUser: UserProfile = impersonatedUnit
    ? {
        ...baseUser,
        role: 'unit_kerja',
        unitId: impersonatedUnit.id,
        unitName: impersonatedUnit.name,
        name: `${baseUser.name} (Akses Unit: ${impersonatedUnit.name})`
      }
    : baseUser;

  // Handle role change
  const handleRoleChange = (role: UserRole) => {
    setImpersonatedUnit(null);
    setLoggedUser(null);
    setActiveRole(role);
    showToast(`Beralih ke mode peran: ${role.replace('_', ' ').toUpperCase()}`, 'info');

    // If switching to Guru, redirect from managerial tab to Dokumen or Indikator
    if (role === 'guru' && (activeTab === 'dashboard' || activeTab === 'evaluasi' || activeTab === 'laporan')) {
      setActiveTab('dokumen');
    }
  };

  // Handle direct login from LoginModal or UserManagementTab
  const handleLoginUser = (user: UserProfile) => {
    setImpersonatedUnit(null);
    setLoggedUser(user);
    setActiveRole(user.role);
    showToast(`Berhasil masuk sebagai ${user.name} (${user.email})!`, 'success');

    // If unit kerja, navigate to lemari tab so they can immediately see their unit cabinet
    if (user.role === 'unit_kerja') {
      setActiveTab('lemari');
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

  // Upload Berkas ke Laci
  const handleUploadBerkasLaci = (
    laciId: string,
    berkas: Omit<BerkasLaci, 'id' | 'laciId' | 'uploadedAt'>
  ) => {
    const yearMatch = selectedPeriode?.match(/\d{4}\/\d{4}/)?.[0] || '2026/2027';
    const newBerkas: BerkasLaci = {
      ...berkas,
      id: `berkas-${Date.now()}`,
      laciId,
      tahunAjaran: berkas.tahunAjaran || yearMatch,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    let targetDrawerName = '';

    setLaciList((prev) => {
      let targetLemariId = '';
      const next = prev.map((laci) => {
        if (laci.id === laciId) {
          targetDrawerName = laci.namaLaci;
          targetLemariId = laci.lemariId;
          return {
            ...laci,
            status: 'menunggu_verifikasi' as const,
            updatedAt: newBerkas.uploadedAt,
            berkasList: [newBerkas, ...laci.berkasList]
          };
        }
        return laci;
      });

      if (targetLemariId) {
        const lemariDrawers = next.filter((l) => l.lemariId === targetLemariId);
        const laciTerisi = lemariDrawers.filter((l) => l.berkasList.length > 0).length;
        const laciDisetujui = lemariDrawers.filter((l) => l.status === 'disetujui').length;
        const laciRevisi = lemariDrawers.filter((l) => l.status === 'revisi').length;
        const laciKosong = lemariDrawers.filter((l) => l.status === 'kosong').length;

        setLemariList((lPrev) =>
          lPrev.map((lem) =>
            lem.id === targetLemariId
              ? {
                  ...lem,
                  laciTerisi,
                  laciDisetujui,
                  laciRevisi,
                  laciKosong,
                  lastUpdated: newBerkas.uploadedAt
                }
              : lem
          )
        );
      }

      return next;
    });

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'UPLOAD_BERKAS_LACI',
      entity: 'LaciUnit',
      entityId: laciId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.45',
      details: `${currentUser.name} mengunggah berkas baru "${newBerkas.namaFile}" ke laci ${targetDrawerName || laciId}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Berkas "${newBerkas.namaFile}" berhasil diserahkan ke laci! Menunggu verifikasi Super Admin.`);
  };

  // Verifikasi Laci (Super Admin)
  const handleVerifikasiLaci = (
    laciId: string,
    status: 'disetujui' | 'revisi',
    catatanAdmin: string
  ) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let targetDrawerName = '';

    setLaciList((prev) => {
      let targetLemariId = '';
      const next = prev.map((laci) => {
        if (laci.id === laciId) {
          targetDrawerName = laci.namaLaci;
          targetLemariId = laci.lemariId;
          return {
            ...laci,
            status,
            catatanSuperAdmin: catatanAdmin,
            verifiedBy: currentUser.name,
            verifiedAt: now,
            updatedAt: now
          };
        }
        return laci;
      });

      if (targetLemariId) {
        const lemariDrawers = next.filter((l) => l.lemariId === targetLemariId);
        const laciDisetujui = lemariDrawers.filter((l) => l.status === 'disetujui').length;
        const laciRevisi = lemariDrawers.filter((l) => l.status === 'revisi').length;
        const laciTerisi = lemariDrawers.filter((l) => l.berkasList.length > 0).length;
        const laciKosong = lemariDrawers.filter((l) => l.status === 'kosong').length;

        setLemariList((lPrev) =>
          lPrev.map((lem) =>
            lem.id === targetLemariId
              ? {
                  ...lem,
                  laciDisetujui,
                  laciRevisi,
                  laciTerisi,
                  laciKosong,
                  lastUpdated: now
                }
              : lem
          )
        );
      }

      return next;
    });

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: status === 'disetujui' ? 'APPROVAL_LACI' : 'REVISI_LACI',
      entity: 'LaciUnit',
      entityId: laciId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.22',
      details: `${currentUser.name} memverifikasi ${targetDrawerName || laciId}: ${status === 'disetujui' ? 'Disetujui (Acc)' : 'Minta Revisi'}. Catatan: "${catatanAdmin}"`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(
      status === 'disetujui'
        ? `Laci berhasil disetujui (Acc)!`
        : `Arahan revisi berhasil dikirim ke unit kerja.`,
      status === 'disetujui' ? 'success' : 'info'
    );
  };

  // Tambah Laci Baru (Super Admin)
  const handleTambahLaci = (lemariId: string, laciData: Partial<LaciUnit>) => {
    const newLaci: LaciUnit = {
      id: `laci-${Date.now()}`,
      lemariId,
      unitId: laciData.unitId || '',
      unitName: laciData.unitName || '',
      kodeLaci: laciData.kodeLaci || 'LACI-NEW',
      namaLaci: laciData.namaLaci || 'Tugas Baru',
      deskripsiTugas: laciData.deskripsiTugas || '',
      kategoriJob: laciData.kategoriJob || 'Pelaksanaan',
      formatWajib: laciData.formatWajib || ['pdf', 'link'],
      isMandatory: laciData.isMandatory ?? true,
      status: 'kosong',
      berkasList: [],
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setLaciList((prev) => [...prev, newLaci]);

    setLemariList((prev) =>
      prev.map((lem) =>
        lem.id === lemariId
          ? {
              ...lem,
              totalLaci: lem.totalLaci + 1,
              laciKosong: lem.laciKosong + 1
            }
          : lem
      )
    );

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'CREATE_LACI',
      entity: 'LaciUnit',
      entityId: newLaci.id,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.10',
      details: `${currentUser.name} menambahkan laci tugas baru "${newLaci.namaLaci}" ke lemari ${lemariId}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Laci tugas baru "${newLaci.namaLaci}" berhasil dipasang pada lemari!`);
  };

  // Ubah Nama & Informasi Unit Kerja (Khusus Super Admin)
  const handleUpdateUnit = (
    unitId: string,
    updatedData: {
      name: string;
      code?: string;
      pic?: string;
      category?: 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan';
      deskripsiJob?: string;
    }
  ) => {
    const oldUnit = unitKerjaList.find((u) => u.id === unitId);
    const oldName = oldUnit ? oldUnit.name : unitId;

    // 1. Update unitKerjaList
    setUnitKerjaList((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          return {
            ...u,
            name: updatedData.name,
            code: updatedData.code || u.code,
            pic: updatedData.pic || u.pic,
            category: updatedData.category || u.category
          };
        }
        return u;
      })
    );

    // 2. Update lemariList
    setLemariList((prev) =>
      prev.map((lem) => {
        if (lem.unitId === unitId) {
          return {
            ...lem,
            unitName: updatedData.name,
            unitCode: updatedData.code || lem.unitCode,
            pic: updatedData.pic || lem.pic,
            unitCategory: updatedData.category || lem.unitCategory,
            deskripsiJob: updatedData.deskripsiJob ?? lem.deskripsiJob
          };
        }
        return lem;
      })
    );

    // 3. Update laciList
    setLaciList((prev) =>
      prev.map((laci) => {
        if (laci.unitId === unitId) {
          return {
            ...laci,
            unitName: updatedData.name,
            kodeLaci: updatedData.code && oldUnit?.code ? laci.kodeLaci.replace(oldUnit.code, updatedData.code) : laci.kodeLaci
          };
        }
        return laci;
      })
    );

    // 4. Update evaluasiList
    setEvaluasiList((prev) =>
      prev.map((ev) => {
        if (ev.unitId === unitId) {
          return {
            ...ev,
            unitName: updatedData.name
          };
        }
        return ev;
      })
    );

    // 5. Update dokumenList
    setDokumenList((prev) =>
      prev.map((doc) => {
        if (doc.unitId === unitId) {
          return {
            ...doc,
            unitName: updatedData.name
          };
        }
        return doc;
      })
    );

    // 6. Update programRtlList
    setProgramRtlList((prev) =>
      prev.map((prog) => {
        if (prog.unitId === unitId) {
          return {
            ...prog,
            unitName: updatedData.name
          };
        }
        return prog;
      })
    );

    // 7. Audit Log
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'UPDATE_UNIT_KERJA',
      entity: 'UnitKerja',
      entityId: unitId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.1',
      details: `${currentUser.name} mengubah nama unit kerja dari "${oldName}" menjadi "${updatedData.name}"`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Nama unit "${oldName}" berhasil diperbarui menjadi "${updatedData.name}"!`);
  };

  // 1. Hapus Berkas dari Laci (Super Admin)
  const handleDeleteBerkasLaci = (laciId: string, berkasId: string) => {
    let deletedFileName = '';
    let targetLemariId = '';

    setLaciList((prev) => {
      const next = prev.map((laci) => {
        if (laci.id === laciId) {
          const targetBerkas = laci.berkasList.find((b) => b.id === berkasId);
          deletedFileName = targetBerkas?.namaFile || berkasId;
          targetLemariId = laci.lemariId;
          const updatedBerkasList = laci.berkasList.filter((b) => b.id !== berkasId);
          const newStatus = updatedBerkasList.length === 0 ? ('kosong' as const) : laci.status;

          return {
            ...laci,
            status: newStatus,
            berkasList: updatedBerkasList,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return laci;
      });

      if (targetLemariId) {
        const lemariDrawers = next.filter((l) => l.lemariId === targetLemariId);
        const laciTerisi = lemariDrawers.filter((l) => l.berkasList.length > 0).length;
        const laciDisetujui = lemariDrawers.filter((l) => l.status === 'disetujui').length;
        const laciRevisi = lemariDrawers.filter((l) => l.status === 'revisi').length;
        const laciKosong = lemariDrawers.filter((l) => l.status === 'kosong').length;

        setLemariList((lPrev) =>
          lPrev.map((lem) =>
            lem.id === targetLemariId
              ? {
                  ...lem,
                  laciTerisi,
                  laciDisetujui,
                  laciRevisi,
                  laciKosong,
                  lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
                }
              : lem
          )
        );
      }

      return next;
    });

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'DELETE_BERKAS_LACI',
      entity: 'BerkasLaci',
      entityId: berkasId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.1',
      details: `${currentUser.name} menghapus berkas "${deletedFileName}" dari laci ${laciId}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Berkas "${deletedFileName}" berhasil dihapus dari laci!`);
  };

  // 2. Edit Laci Tugas (Super Admin)
  const handleEditLaci = (laciId: string, updatedData: Partial<LaciUnit>) => {
    setLaciList((prev) =>
      prev.map((laci) => {
        if (laci.id === laciId) {
          return {
            ...laci,
            ...updatedData,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return laci;
      })
    );

    showToast(`Pengaturan laci tugas berhasil diperbarui!`);
  };

  // 3. Hapus Laci Tugas (Super Admin)
  const handleDeleteLaci = (laciId: string) => {
    const targetLaci = laciList.find((l) => l.id === laciId);
    if (!targetLaci) return;

    setLaciList((prev) => {
      const next = prev.filter((l) => l.id !== laciId);
      const targetLemariId = targetLaci.lemariId;

      const lemariDrawers = next.filter((l) => l.lemariId === targetLemariId);
      const laciTerisi = lemariDrawers.filter((l) => l.berkasList.length > 0).length;
      const laciDisetujui = lemariDrawers.filter((l) => l.status === 'disetujui').length;
      const laciRevisi = lemariDrawers.filter((l) => l.status === 'revisi').length;
      const laciKosong = lemariDrawers.filter((l) => l.status === 'kosong').length;

      setLemariList((lPrev) =>
        lPrev.map((lem) =>
          lem.id === targetLemariId
            ? {
                ...lem,
                totalLaci: lemariDrawers.length,
                laciTerisi,
                laciDisetujui,
                laciRevisi,
                laciKosong
              }
            : lem
        )
      );

      return next;
    });

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'DELETE_LACI',
      entity: 'LaciUnit',
      entityId: laciId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.1',
      details: `${currentUser.name} menghapus laci tugas "${targetLaci.namaLaci}" dari lemari`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Laci tugas "${targetLaci.namaLaci}" berhasil dihapus!`);
  };

  // 4. Setujui Massal Semua Laci Menunggu Verifikasi (Super Admin)
  const handleBulkApproveAll = () => {
    const pendingList = laciList.filter((l) => l.status === 'menunggu_verifikasi');
    if (pendingList.length === 0) {
      showToast('Tidak ada laci yang menunggu verifikasi saat ini.', 'info');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setLaciList((prev) =>
      prev.map((laci) => {
        if (laci.status === 'menunggu_verifikasi') {
          return {
            ...laci,
            status: 'disetujui' as const,
            catatanSuperAdmin: 'Disetujui massal oleh Super Admin (Acc All).',
            verifiedBy: currentUser.name,
            verifiedAt: now,
            updatedAt: now
          };
        }
        return laci;
      })
    );

    // Update all lemari
    setLemariList((prev) =>
      prev.map((lem) => {
        const lemDrawers = laciList.filter((l) => l.lemariId === lem.id);
        const laciTerisi = lemDrawers.filter((l) => l.berkasList.length > 0).length;
        const laciDisetujui = lemDrawers.filter(
          (l) => l.status === 'disetujui' || l.status === 'menunggu_verifikasi'
        ).length;
        const laciKosong = lemDrawers.filter((l) => l.status === 'kosong').length;

        return {
          ...lem,
          laciTerisi,
          laciDisetujui,
          laciRevisi: 0,
          laciKosong,
          lastUpdated: now
        };
      })
    );

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'BULK_APPROVE_LACI',
      entity: 'LaciUnit',
      entityId: 'bulk',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.1',
      details: `${currentUser.name} menyetujui massal (Bulk Acc) seluruh ${pendingList.length} laci tugas pending`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Berhasil menyetujui massal ${pendingList.length} laci tugas sekaligus!`);
  };

  // 5. Override Status Laci Seketika (Super Admin Instant Status)
  const handleOverrideStatusLaci = (laciId: string, newStatus: any) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let targetDrawerName = '';

    setLaciList((prev) => {
      let targetLemariId = '';
      const next = prev.map((laci) => {
        if (laci.id === laciId) {
          targetDrawerName = laci.namaLaci;
          targetLemariId = laci.lemariId;
          return {
            ...laci,
            status: newStatus,
            updatedAt: now,
            verifiedBy: currentUser.name,
            verifiedAt: now
          };
        }
        return laci;
      });

      if (targetLemariId) {
        const lemariDrawers = next.filter((l) => l.lemariId === targetLemariId);
        const laciDisetujui = lemariDrawers.filter((l) => l.status === 'disetujui').length;
        const laciRevisi = lemariDrawers.filter((l) => l.status === 'revisi').length;
        const laciTerisi = lemariDrawers.filter((l) => l.berkasList.length > 0).length;
        const laciKosong = lemariDrawers.filter((l) => l.status === 'kosong').length;

        setLemariList((lPrev) =>
          lPrev.map((lem) =>
            lem.id === targetLemariId
              ? {
                  ...lem,
                  laciDisetujui,
                  laciRevisi,
                  laciTerisi,
                  laciKosong,
                  lastUpdated: now
                }
              : lem
          )
        );
      }

      return next;
    });

    showToast(`Status laci "${targetDrawerName || laciId}" diubah seketika menjadi: ${newStatus.toUpperCase()}!`);
  };

  // 6. Tambah Unit & Lemari Baru (Super Admin)
  const handleTambahLemariUnit = (data: {
    name: string;
    code: string;
    category: 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan';
    pic: string;
    email: string;
    deskripsiJob: string;
  }) => {
    const newUnitId = `unit-${Date.now()}`;
    const newLemariId = `lemari-${Date.now()}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newUnit: UnitKerja = {
      id: newUnitId,
      code: data.code,
      name: data.name,
      category: data.category,
      picUserId: `user-${Date.now()}`,
      pic: data.pic,
      email: data.email,
      score: 0,
      totalIndicators: 5,
      completedIndicators: 0,
      status: 'Baik'
    };

    const newLemari: LemariUnit = {
      id: newLemariId,
      unitId: newUnitId,
      unitCode: data.code,
      unitName: data.name,
      unitCategory: data.category,
      pic: data.pic,
      tahunAjaran: '2025/2026',
      deskripsiJob: data.deskripsiJob,
      totalLaci: 2,
      laciTerisi: 0,
      laciDisetujui: 0,
      laciRevisi: 0,
      laciKosong: 2,
      status: 'Aktif',
      lastUpdated: now
    };

    const defaultLaciA: LaciUnit = {
      id: `laci-${Date.now()}-1`,
      lemariId: newLemariId,
      unitId: newUnitId,
      unitName: data.name,
      kodeLaci: 'LACI-A',
      namaLaci: 'Program Kerja & Rencana Kerja Tahunan',
      deskripsiTugas: `Dokumen perencanaan program kerja ${data.name} untuk tahun ajaran aktif.`,
      kategoriJob: 'Perencanaan',
      formatWajib: ['pdf', 'link'],
      isMandatory: true,
      status: 'kosong',
      berkasList: [],
      updatedAt: now
    };

    const defaultLaciB: LaciUnit = {
      id: `laci-${Date.now()}-2`,
      lemariId: newLemariId,
      unitId: newUnitId,
      unitName: data.name,
      kodeLaci: 'LACI-B',
      namaLaci: 'Laporan Pelaksanaan Kegiatan & Bukti Fisik',
      deskripsiTugas: `Laporan kegiatan operasional dan bukti fisik pelaksanaan tugas unit.`,
      kategoriJob: 'Pelaksanaan',
      formatWajib: ['pdf', 'image', 'link'],
      isMandatory: true,
      status: 'kosong',
      berkasList: [],
      updatedAt: now
    };

    setUnitKerjaList((prev) => [...prev, newUnit]);
    setLemariList((prev) => [...prev, newLemari]);
    setLaciList((prev) => [...prev, defaultLaciA, defaultLaciB]);

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'CREATE_LEMARI_UNIT',
      entity: 'LemariUnit',
      entityId: newLemariId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.1',
      details: `${currentUser.name} mendaftarkan unit kerja & lemari baru "${data.name}" (${data.code})`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Lemari unit baru "${data.name}" berhasil ditambahkan ke rak sekolah!`);
  };

  // 7. Hapus Lemari & Unit (Super Admin)
  const handleDeleteLemariUnit = (unitId: string) => {
    const targetUnit = unitKerjaList.find((u) => u.id === unitId);
    if (!targetUnit) return;

    setUnitKerjaList((prev) => prev.filter((u) => u.id !== unitId));
    setLemariList((prev) => prev.filter((l) => l.unitId !== unitId));
    setLaciList((prev) => prev.filter((l) => l.unitId !== unitId));

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.replace('_', ' '),
      action: 'DELETE_LEMARI_UNIT',
      entity: 'LemariUnit',
      entityId: unitId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.10.1',
      details: `${currentUser.name} menghapus unit kerja dan lemari arsip "${targetUnit.name}"`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Unit kerja "${targetUnit.name}" beserta lemarinya berhasil dihapus!`);
  };

  // 8. Impersonasi / Masuk sebagai Unit Tertentu (Super Admin)
  const handleImpersonateUnit = (unitId: string | null) => {
    if (!unitId) {
      setImpersonatedUnit(null);
      showToast('Keluar dari penyamaran. Kembali ke mode Super Admin.', 'info');
      return;
    }

    const targetUnit = unitKerjaList.find((u) => u.id === unitId);
    if (targetUnit) {
      setImpersonatedUnit(targetUnit);
      showToast(`Sekarang menyamar sebagai: ${targetUnit.name}. Privasi unit lain terkunci.`, 'info');
    }
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
  const laciPendingCount = laciList.filter(
    (l) => l.status === 'menunggu_verifikasi'
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
          rtlAktif: rtlAktifCount,
          laciPending: laciPendingCount
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
          onOpenLoginModal={() => setShowLoginModal(true)}
        />

        {/* Modal Login & Switch Account */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          currentUser={currentUser}
          onLogin={handleLoginUser}
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

          {/* Impersonation Banner for Super Admin */}
          {impersonatedUnit && (
            <div className="mb-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-3.5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-amber-400/40 animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5">
                <span className="bg-white text-amber-700 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase shadow-2xs">
                  🎭 Mode Penyamaran Unit Aktif
                </span>
                <span className="text-xs font-semibold">
                  Anda sedang melihat antarmuka sebagai <strong>{impersonatedUnit.name}</strong> ({impersonatedUnit.code}). Lemari unit lain terkunci anti-nyontek.
                </span>
              </div>
              <button
                onClick={() => handleImpersonateUnit(null)}
                className="self-start sm:self-auto text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-amber-50 shadow-xs transition cursor-pointer"
              >
                Kembali ke Super Admin ⚡
              </button>
            </div>
          )}

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

          {activeTab === 'lemari' && (
            <LemariTab
              userRole={activeRole}
              currentUser={currentUser}
              lemariList={lemariList}
              laciList={laciList}
              selectedPeriode={selectedPeriode}
              onPeriodeChange={setSelectedPeriode}
              onUploadBerkas={handleUploadBerkasLaci}
              onVerifikasiLaci={handleVerifikasiLaci}
              onTambahLaci={handleTambahLaci}
              onUpdateUnit={handleUpdateUnit}
              onDeleteBerkas={handleDeleteBerkasLaci}
              onEditLaci={handleEditLaci}
              onDeleteLaci={handleDeleteLaci}
              onBulkApproveAll={handleBulkApproveAll}
              onTambahLemariUnit={handleTambahLemariUnit}
              onDeleteLemariUnit={handleDeleteLemariUnit}
              onOverrideStatusLaci={handleOverrideStatusLaci}
              onImpersonateUnit={handleImpersonateUnit}
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
              onLoginAsUser={handleLoginUser}
              onUpdateUnit={handleUpdateUnit}
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
