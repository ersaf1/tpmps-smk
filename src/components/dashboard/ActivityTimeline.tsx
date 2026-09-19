'use client';

import React from 'react';
import Link from 'next/link';
import { ActivityLogItem } from '@/types/sigma';
import { Shield, FileCheck2, UploadCloud, Database, ArrowRight, User } from 'lucide-react';

interface ActivityTimelineProps {
  logs: ActivityLogItem[];
}

export default function ActivityTimeline({ logs }: ActivityTimelineProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'APPROVAL_EVALUASI':
        return { icon: FileCheck2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
      case 'UPLOAD_DOKUMEN':
        return { icon: UploadCloud, color: 'text-[#22D3EE]', bg: 'bg-[#22D3EE]/10 border-[#22D3EE]/30' };
      case 'CREATE_EVALUASI':
      case 'UPDATE_EVALUASI':
        return { icon: Shield, color: 'text-[#0077B6]', bg: 'bg-[#0077B6]/10 border-[#0077B6]/30' };
      default:
        return { icon: Database, color: 'text-[#F6B73C]', bg: 'bg-[#F6B73C]/10 border-[#F6B73C]/30' };
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] tracking-tight">
            AKTIVITAS SISTEM TERKINI
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Jejak audit dan pembaruan instrumen penjaminan mutu
          </p>
        </div>

        <Link
          href="/laporan"
          className="text-xs font-semibold text-[#22D3EE] hover:underline flex items-center gap-1"
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
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all flex items-start gap-3.5"
            >
              <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${bg} ${color}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#F8FAFC] truncate">
                    {log.userName}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono shrink-0">
                    {log.createdAt}
                  </span>
                </div>

                <div className="text-[11px] text-[#22D3EE] font-medium mt-0.5">
                  {log.action.replace('_', ' ')} • {log.entity} ({log.entityId})
                </div>

                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed line-clamp-2">
                  {log.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#94A3B8]">
        <span>Jejak audit tersimpan otomatis dan immutable</span>
        <span className="font-mono text-[10px] text-[#22D3EE]">POSTGRESQL AUDIT</span>
      </div>
    </div>
  );
}
