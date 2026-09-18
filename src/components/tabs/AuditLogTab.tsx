'use client';

import React, { useState } from 'react';
import { AuditLogItem, UserRole } from '@/types/tpmps';
import {
  History,
  Search,
  Filter,
  Shield,
  Download,
  Calendar,
  FileCheck2,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface AuditLogTabProps {
  userRole: UserRole;
  auditLogs: AuditLogItem[];
}

export default function AuditLogTab({ userRole, auditLogs }: AuditLogTabProps) {
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const actions = [
    'all',
    'APPROVAL_LAPORAN',
    'REVIEW_EVALUASI',
    'SUBMIT_EVALUASI',
    'VERIFIKASI_DOKUMEN',
    'CREATE_RTL',
    'CREATE_USER'
  ];

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedAction !== 'all' && log.action !== selectedAction) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.ipAddress.includes(q)
      );
    }
    return true;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'APPROVAL_LAPORAN':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REVIEW_EVALUASI':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SUBMIT_EVALUASI':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'VERIFIKASI_DOKUMEN':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'CREATE_RTL':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CREATE_USER':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Jejak Audit & Log Aktivitas Sistem (Audit Trail)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rekaman digital seluruh transaksi penilaian, persetujuan skor, pengunggahan dokumen bukti, dan manipulasi data.
          </p>
        </div>

        <button
          onClick={() => alert('Log audit diekspor ke file CSV terenkripsi.')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Ekspor Log (CSV)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Action Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Aksi:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Jenis Aksi</option>
            {actions
              .filter((a) => a !== 'all')
              .map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari user, aktivitas, atau IP..."
            className="w-full sm:w-64 text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Waktu (WIB)</th>
                <th className="py-3 px-4">Pelaku (Pengguna)</th>
                <th className="py-3 px-3">Jenis Aksi</th>
                <th className="py-3 px-4">Detail Perubahan & Transaksi</th>
                <th className="py-3 px-3">Entitas</th>
                <th className="py-3 px-3">Alamat IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.userName}</div>
                    <span className="text-[10px] text-slate-400 font-medium">{item.role}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getActionBadge(
                        item.action
                      )}`}
                    >
                      {item.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-sm">
                    <p className="leading-snug">{item.details}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                    {item.entity}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                    {item.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
