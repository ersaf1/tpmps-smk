'use client';

import React from 'react';
import Link from 'next/link';
import { ActivityLogItem } from '@/types/sintesa';
import { Shield, FileCheck2, UploadCloud, Database, ArrowRight, User } from 'lucide-react';

interface ActivityTimelineProps {
  logs: ActivityLogItem[];
}

export default function ActivityTimeline({ logs }: ActivityTimelineProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'APPROVAL_EVALUASI':
        return { icon: FileCheck2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
      case 'UPLOAD_DOKUMEN':
        return { icon: UploadCloud, color: 'text-[#0077B6]', bg: 'bg-sky-50 border-sky-200' };
      case 'CREATE_EVALUASI':
      case 'UPDATE_EVALUASI':
        return { icon: Shield, color: 'text-[#0284C7]', bg: 'bg-blue-50 border-blue-200' };
      default:
        return { icon: Database, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            AKTIVITAS SISTEM TERKINI
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Jejak audit dan pembaruan instrumen penjaminan mutu
          </p>
        </div>

        <Link
          href="/laporan"
          className="text-xs font-semibold text-[#0077B6] hover:underline flex items-center gap-1"
        >
          <span>Semua Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Timeline List */}
      <div className="space-y-3.5 overflow-y-auto max-h-[300px] pr-1">
        {logs.slice(0, 5).map((log) => {
          const { icon: Icon, color, bg } = getActionIcon(log.action);
          return (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 transition-all flex items-start gap-3.5"
            >
              <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${bg} ${color}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {log.userName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {log.createdAt}
                  </span>
                </div>

                <div className="text-[11px] text-[#0077B6] font-semibold mt-0.5">
                  {log.action.replace('_', ' ')} • {log.entity} ({log.entityId})
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                  {log.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Jejak audit tersimpan otomatis dan immutable</span>
        <span className="font-mono text-[10px] font-bold text-[#0077B6] bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">POSTGRESQL AUDIT</span>
      </div>
    </div>
  );
}
