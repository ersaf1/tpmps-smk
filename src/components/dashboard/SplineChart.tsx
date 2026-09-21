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
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
      {/* Top Header Card */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              TREN CAPAIAN MUTU 8 SNP
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0077B6] border border-sky-200">
              Semester Ganjil 2025/2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Progres akumulasi capaian mutu sekolah dibandingkan target akreditasi
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0077B6] shadow-[0_0_8px_#0077B6]" />
            <span className="text-slate-700 font-medium">Realisasi Capaian</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-slate-300" />
            <span className="text-slate-400">Target Akreditasi A</span>
          </div>
        </div>
      </div>

      {/* SVG Clean Spline Graph */}
      <div className="relative w-full overflow-x-auto py-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 sm:h-52 overflow-visible"
        >
          <defs>
            <linearGradient id="splineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0077B6" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#0284C7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0077B6" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0077B6" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#0284C7" floodOpacity="0.4" />
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
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  fill="#64748B"
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
                    fill="#0284C7"
                    fillOpacity="0.2"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? '6' : '4'}
                  fill={isHovered ? '#0077B6' : '#FFFFFF'}
                  stroke="#0077B6"
                  strokeWidth={isHovered ? '3' : '2'}
                />
                {/* Month label on X-axis */}
                <text
                  x={pt.x}
                  y={height - 8}
                  fill={isHovered ? '#0077B6' : '#64748B'}
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

      {/* Bottom Metrics Bar */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">
            Rata-rata Mutu
          </div>
          <div className="text-lg sm:text-xl font-black text-[#0077B6] mt-0.5">
            87.2%
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">
            Target Akreditasi
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-600 mt-0.5">
            95.0%
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">
            Tren Pertumbuhan
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>+3.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
