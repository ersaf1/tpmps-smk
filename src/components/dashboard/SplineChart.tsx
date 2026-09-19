'use client';

import React, { useState } from 'react';
import { TrendingUp, Award, Target, Sparkles } from 'lucide-react';

interface DataPoint {
  month: string;
  score: number;
  target: number;
}

const DATA_POINTS: DataPoint[] = [
  { month: 'Jul', score: 78.5, target: 85 },
  { month: 'Agu', score: 81.2, target: 88 },
  { month: 'Sep', score: 84.8, target: 90 },
  { month: 'Okt', score: 83.0, target: 90 },
  { month: 'Nov', score: 87.5, target: 92 },
  { month: 'Des', score: 89.2, target: 95 }
];

export default function SplineChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(4); // Default select Nov

  // SVG coordinates calculation (width 600, height 220)
  const width = 600;
  const height = 200;
  const paddingX = 40;
  const paddingY = 30;

  const minScore = 70;
  const maxScore = 100;

  const points = DATA_POINTS.map((d, i) => {
    const x = paddingX + (i / (DATA_POINTS.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.score - minScore) / (maxScore - minScore)) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  // Generate smooth cubic bezier SVG path
  const splinePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pt.x},${pt.y}`;
  }, '');

  // Fill area under spline curve
  const areaPath = `${splinePath} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden flex flex-col justify-between">
      {/* Top Header Card */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] tracking-tight">
              TREN CAPAIAN MUTU 8 SNP
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30">
              Semester Ganjil 2025/2026
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Progres akumulasi capaian mutu sekolah dibandingkan target akreditasi
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
            <span className="text-[#F8FAFC] font-medium">Realisasi Capaian</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-white/40" />
            <span className="text-[#94A3B8]">Target Akreditasi A</span>
          </div>
        </div>
      </div>

      {/* SVG Neon Spline Graph matching reference/uiux.png */}
      <div className="relative w-full overflow-x-auto py-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 overflow-visible"
        >
          <defs>
            <linearGradient id="splineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#0077B6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#06162E" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0077B6" />
              <stop offset="50%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22D3EE" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Horizontal Grid lines */}
          {[70, 80, 90, 100].map((val) => {
            const y = height - paddingY - ((val - minScore) / (maxScore - minScore)) * (height - paddingY * 2);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#splineGradient)" />

          {/* Spline Curve Stroke */}
          <path
            d={splinePath}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#neonGlow)"
          />

          {/* Data Points with Halo Circles */}
          {points.map((pt, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g
                key={pt.month}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
              >
                {/* Outer halo on active point */}
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill="#22D3EE"
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? '6' : '4'}
                  fill="#06162E"
                  stroke="#22D3EE"
                  strokeWidth={isHovered ? '3' : '2'}
                  filter={isHovered ? 'url(#neonGlow)' : undefined}
                />
                {/* Month label on X-axis */}
                <text
                  x={pt.x}
                  y={height - 8}
                  fill={isHovered ? '#22D3EE' : '#94A3B8'}
                  fontSize="11"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  textAnchor="middle"
                >
                  {pt.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Metrics Bar matching reference/uiux.png */}
      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="text-[11px] font-semibold text-[#94A3B8] uppercase">
            Rata-rata Mutu
          </div>
          <div className="text-lg sm:text-xl font-black text-[#22D3EE] mt-0.5">
            87.2%
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="text-[11px] font-semibold text-[#94A3B8] uppercase">
            Target Akreditasi
          </div>
          <div className="text-lg sm:text-xl font-black text-[#F6B73C] mt-0.5">
            95.0%
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="text-[11px] font-semibold text-[#94A3B8] uppercase">
            Tren Pertumbuhan
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>+3.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
