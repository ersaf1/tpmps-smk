'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="glass-panel-glow max-w-md w-full rounded-2xl p-6 relative border border-white/15 animate-in zoom-in-95 duration-150 shadow-2xl">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              isDestructive
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                : 'bg-[#22D3EE]/15 border border-[#22D3EE]/30 text-[#22D3EE]'
            }`}
          >
            {isDestructive ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">{title}</h3>
            <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="btn-enterprise px-4 py-2 rounded-xl text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 cursor-pointer"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`btn-enterprise px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-lg cursor-pointer ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                : 'bg-gradient-to-r from-[#0077B6] to-[#22D3EE] shadow-cyan-500/30'
            }`}
          >
            {isLoading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
