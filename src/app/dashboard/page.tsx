'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import DynamicWelcomeBanner from '@/components/dashboard/DynamicWelcomeBanner';
import MetricCardsGrid from '@/components/dashboard/MetricCardsGrid';
import SplineChart from '@/components/dashboard/SplineChart';
import DonutDistributionChart from '@/components/dashboard/DonutDistributionChart';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import { sigmaService } from '@/lib/services/sigmaDataService';
import { UserProfile, StandardSNP, ActivityLogItem } from '@/types/sigma';
import { ArrowRight, ChevronRight, Award, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile>(sigmaService.getActiveUser());
  const [standards, setStandards] = useState<StandardSNP[]>([]);
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [pendingDocsCount, setPendingDocsCount] = useState(0);
  const [validDocsCount, setValidDocsCount] = useState(0);
  const [activeEvalsCount, setActiveEvalsCount] = useState(0);
  const [activeRtlCount, setActiveRtlCount] = useState(0);

  useEffect(() => {
    const activeUser = sigmaService.getActiveUser();
    setUser(activeUser);

    const stdList = sigmaService.getStandards();
    setStandards(stdList);

    const docList = sigmaService.getDocuments();
    setValidDocsCount(docList.filter((d) => d.status === 'Terverifikasi').length);
    setPendingDocsCount(docList.filter((d) => d.status === 'Menunggu Review').length);

    const evalList = sigmaService.getEvaluations();
    setActiveEvalsCount(evalList.length);

    const rtlList = sigmaService.getRtlList();
    setActiveRtlCount(rtlList.filter((r) => r.status === 'Sedang Berjalan').length);

    setLogs(sigmaService.getLogs());
  }, []);

  return (
    <AppShell
      title="Dashboard Penjaminan Mutu"
      subtitle="Monitoring Agregat 8 Standar Nasional Pendidikan SMK Negeri 2 Magelang"
    >
      {/* Dynamic Welcome Banner (Replaces old simulated role banner) */}
      <DynamicWelcomeBanner
        user={user}
        pendingDocsCount={pendingDocsCount}
        activeEvalsCount={activeEvalsCount}
        activeRtlCount={activeRtlCount}
      />

      {/* Top 4 Production KPIs */}
      <MetricCardsGrid
        totalStandards={standards.length || 8}
        validDocsCount={validDocsCount}
        activeEvalsCount={activeEvalsCount}
        activeRtlCount={activeRtlCount}
      />

      {/* Telemetry Charts Grid (Spline Line Chart & Grade Distribution Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-7">
          <SplineChart />
        </div>
        <div className="lg:col-span-5">
          <DonutDistributionChart />
        </div>
      </div>

      {/* 8 SNP Progress Overview & Live Audit Trail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 8 Standar Mutu Progress Bars */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] tracking-tight">
                CAPAIAN 8 STANDAR NASIONAL PENDIDIKAN (SNP)
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Monitoring skor realisasi berbobot vs target mutu 95.0%
              </p>
            </div>

            <Link
              href="/mutu/1"
              className="text-xs font-semibold text-[#22D3EE] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Detail Mutu</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {standards.map((snp) => {
              return (
                <Link
                  key={snp.id}
                  href={`/mutu/${snp.id}`}
                  className="block p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-xs font-bold text-[#22D3EE] font-mono shrink-0">
                        {snp.code}
                      </span>
                      <span className="text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22D3EE] transition-colors">
                        {snp.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-[#F8FAFC]">
                        {snp.currentScore.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-[#94A3B8] font-mono">
                        / {snp.targetScore}%
                      </span>
                    </div>
                  </div>

                  {/* High tech progress indicator bar */}
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#0077B6] to-[#22D3EE]"
                      style={{ width: `${Math.min(100, snp.currentScore)}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#94A3B8]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sesuai instrumen akreditasi vokasi BAP-S/M</span>
            </div>
            <span className="font-semibold text-[#22D3EE]">SMK PK / Rujukan</span>
          </div>
        </div>

        {/* Right: Live Activity Timeline */}
        <div className="lg:col-span-5">
          <ActivityTimeline logs={logs} />
        </div>
      </div>
    </AppShell>
  );
}
