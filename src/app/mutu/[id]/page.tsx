'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { sigmaService } from '@/lib/services/sigmaDataService';
import { StandardSNP, EvaluasiMutu, BuktiDokumen } from '@/types/sigma';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Activity,
  CheckSquare,
  Users,
  Building2,
  Layers,
  BadgePercent,
  Plus,
  UploadCloud,
  FileCheck2,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function StandardDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [standard, setStandard] = useState<StandardSNP | null>(null);
  const [evaluations, setEvaluations] = useState<EvaluasiMutu[]>([]);
  const [documents, setDocuments] = useState<BuktiDokumen[]>([]);

  useEffect(() => {
    if (!id) return;
    const std = sigmaService.getStandardById(id);
    if (std) {
      setStandard(std);
      const evals = sigmaService.getEvaluations().filter((e) => e.standardId === id);
      setEvaluations(evals);
      const docs = sigmaService.getDocuments().filter((d) => d.standardId === id);
      setDocuments(docs);
    }
  }, [id]);

  const getStandardIcon = (icon: string) => {
    switch (icon) {
      case 'GraduationCap':
      case 'Award':
        return <Award className="w-8 h-8 text-[#22D3EE]" />;
      case 'BookOpen':
        return <BookOpen className="w-8 h-8 text-[#22D3EE]" />;
      case 'Activity':
        return <Activity className="w-8 h-8 text-[#22D3EE]" />;
      case 'CheckSquare':
        return <CheckSquare className="w-8 h-8 text-[#22D3EE]" />;
      case 'Users':
        return <Users className="w-8 h-8 text-[#22D3EE]" />;
      case 'Building2':
        return <Building2 className="w-8 h-8 text-[#22D3EE]" />;
      case 'Layers':
        return <Layers className="w-8 h-8 text-[#22D3EE]" />;
      default:
        return <BadgePercent className="w-8 h-8 text-[#22D3EE]" />;
    }
  };

  if (!standard) {
    return (
      <AppShell title="Standar Mutu Pendidikan">
        <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto">
          <p className="text-sm text-[#94A3B8]">Standar mutu tidak ditemukan.</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-xs text-[#22D3EE] font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`${standard.code}: ${standard.name}`}
      subtitle="Monitoring Detail Capaian Standar Nasional Pendidikan SMK Negeri 2 Magelang"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/dokumen/upload?standardId=${standard.id}`}
              className="btn-enterprise px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#22D3EE] flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Unggah Bukti</span>
            </Link>

            <Link
              href={`/evaluasi/create?standardId=${standard.id}`}
              className="btn-enterprise px-4 py-2 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#22D3EE] text-xs font-bold text-white flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Input Instrumen Baru</span>
            </Link>
          </div>
        </div>

        {/* Master Standard Telemetry Card */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-start gap-4">
              <div className="p-4 rounded-2xl bg-[#0077B6]/20 border border-[#22D3EE]/30 shrink-0">
                {getStandardIcon(standard.icon)}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#22D3EE] px-2.5 py-0.5 rounded-lg bg-[#0077B6]/30 border border-[#22D3EE]/30">
                    {standard.code}
                  </span>
                  <span className="text-xs font-bold text-[#F6B73C]">
                    Bobot Akreditasi: {standard.weight}%
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
                  {standard.name}
                </h2>

                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 max-w-2xl leading-relaxed">
                  {standard.description}
                </p>
              </div>
            </div>

            {/* Score Pill */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                Skor Realisasi SNP
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#22D3EE] font-mono mt-0.5">
                {standard.currentScore.toFixed(1)}%
              </div>
              <span className="text-[11px] text-[#F6B73C] font-semibold block">
                Target Mutu: {standard.targetScore}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#94A3B8]">Tingkat Ketercapaian Standar</span>
              <span className="text-[#22D3EE] font-bold">
                {standard.currentScore.toFixed(1)}% / {standard.targetScore}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0077B6] to-[#22D3EE]"
                style={{ width: `${Math.min(100, (standard.currentScore / standard.targetScore) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section: Linked Evaluations */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                Instrumen Evaluasi Mutu Terkait ({evaluations.length})
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Daftar penilaian mandiri dan verifikasi audit pada standar ini
              </p>
            </div>

            <Link
              href="/evaluasi"
              className="text-xs font-semibold text-[#22D3EE] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Evaluasi</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {evaluations.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/5 text-center text-xs text-[#94A3B8]">
              Belum ada instrumen evaluasi yang diinputkan untuk standar ini.
            </div>
          ) : (
            <div className="space-y-3">
              {evaluations.map((ev) => (
                <Link
                  key={ev.id}
                  href={`/evaluasi/${ev.id}`}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-4 block group"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#22D3EE]">
                        {ev.code}
                      </span>
                      <span className="text-xs text-[#94A3B8]">• {ev.unitName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30 font-bold">
                        {ev.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#F8FAFC] truncate group-hover:text-[#22D3EE] transition-colors">
                      {ev.indikatorName}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-[#F8FAFC] font-mono block">
                      {(ev.nilaiVerifikasi ?? ev.nilaiMandiri).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">
                      {ev.nilaiVerifikasi !== undefined ? 'Terverifikasi' : 'Mandiri'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Section: Linked Evidence Documents */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                Berkas Bukti Standar ({documents.length})
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Dokumen fisik yang diunggah untuk memenuhi pembuktian standar ini
              </p>
            </div>

            <Link
              href={`/dokumen/upload?standardId=${standard.id}`}
              className="text-xs font-semibold text-[#22D3EE] hover:underline flex items-center gap-1"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Unggah Berkas Baru</span>
            </Link>
          </div>

          {documents.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/5 text-center text-xs text-[#94A3B8]">
              Belum ada berkas fisik pendukung untuk standar ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-3"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#22D3EE]">
                        {doc.code}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {doc.status}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-[#F8FAFC] truncate">
                      {doc.title}
                    </h5>
                    <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5 block">
                      {doc.fileSize} • {doc.unitName}
                    </span>
                  </div>

                  <Link
                    href={`/dokumen/${doc.id}`}
                    className="btn-enterprise px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-[#22D3EE] shrink-0"
                  >
                    Buka
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
