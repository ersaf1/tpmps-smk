'use client';

import React from 'react';

export function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-xl border border-slate-100 ${className}`}
    />
  );
}

export function SkeletonMetricCard() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <SkeletonBox className="w-24 h-4" />
        <SkeletonBox className="w-10 h-10 rounded-xl" />
      </div>
      <SkeletonBox className="w-20 h-8" />
      <SkeletonBox className="w-36 h-3" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden p-4 space-y-3">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <SkeletonBox className="w-48 h-6" />
        <SkeletonBox className="w-32 h-8" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 py-3 border-b border-slate-100">
            {Array.from({ length: cols }).map((_, c) => (
              <SkeletonBox key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  title = 'Tidak Ada Data',
  description = 'Belum ada catatan atau dokumen yang tersedia untuk kriteria ini.',
  actionLabel,
  onAction
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-4 text-[#0077B6]">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-sm font-semibold shadow-md shadow-sky-500/20 cursor-pointer transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Terjadi Kesalahan',
  message = 'Sistem tidak dapat memuat data. Periksa koneksi jaringan atau coba beberapa saat lagi.',
  onRetry
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-3 text-rose-600">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-rose-900 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
        >
          Coba Muat Ulang
        </button>
      )}
    </div>
  );
}
