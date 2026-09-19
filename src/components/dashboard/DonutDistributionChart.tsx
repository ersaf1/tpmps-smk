'use client';

import React from 'react';
import { Award, CheckCircle2, AlertCircle } from 'lucide-react';

interface Segment {
  label: string;
  range: string;
  count: number;
  percentage: number;
  color: string;
  glow: string;
}

const SEGMENTS: Segment[] = [
  { label: 'Unggul (A)', range: '90 - 100%', count: 8, percentage: 44, color: '#22D3EE', glow: 'shadow-[0_0_12px_#22D3EE]' },
  { label: 'Baik (B)', range: '80 - 89%', count: 7, percentage: 39, color: '#0077B6', glow: 'shadow-[0_0_12px_#0077B6]' },
  { label: 'Cukup (C)', range: '70 - 79%', count: 2, percentage: 11, color: '#F6B73C', glow: 'shadow-[0_0_12px_#F6B73C]' },
  { label: 'Perlu Perhatian', range: '< 70%', count: 1, percentage: 6, color: '#F28C28', glow: 'shadow-[0_0_12px_#F28C28]' }
];

export default function DonutDistributionChart() {
  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] tracking-tight">
            DISTRIBUSI PREDIKAT MUTU
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Analisis sebaran mutu 18 unit kerja SMK Negeri 2 Magelang
          </p>
        </div>
      </div>

      {/* SVG Donut Visual */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="rotate-[-90deg]">
            {SEGMENTS.map((seg) => {
              const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativeOffset;
              cumulativeOffset += (seg.percentage / 100) * circumference;

              return (
                <circle
                  key={seg.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 hover:opacity-80"
                />
              );
            })}
          </svg>

          {/* Center Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-[#F8FAFC]">18</span>
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Unit Kerja
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full space-y-2.5">
          {SEGMENTS.map((seg) => (
            <div
              key={seg.label}
              className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <div>
                  <span className="font-bold text-[#F8FAFC]">{seg.label}</span>
                  <span className="text-[10px] text-[#94A3B8] block">{seg.range}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-[#F8FAFC]">{seg.count} Unit</span>
                <span className="text-[10px] text-[#22D3EE] font-mono block">
                  {seg.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-[#94A3B8]">
        Mayoritas unit kerja (83%) telah mencapai predikat <span className="text-[#22D3EE] font-semibold">Unggul & Baik</span>.
      </div>
    </div>
  );
}
