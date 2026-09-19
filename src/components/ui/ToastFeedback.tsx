'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastType = 'success', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const config = {
            success: {
              icon: CheckCircle2,
              border: 'border-emerald-500/40',
              bg: 'bg-[#0E1B24]/95',
              glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
              text: 'text-emerald-400',
              title: 'Berhasil'
            },
            warning: {
              icon: AlertTriangle,
              border: 'border-[#F28C28]/40',
              bg: 'bg-[#1D1610]/95',
              glow: 'shadow-[0_0_20px_rgba(242,140,40,0.2)]',
              text: 'text-[#F28C28]',
              title: 'Perhatian'
            },
            error: {
              icon: XCircle,
              border: 'border-rose-500/40',
              bg: 'bg-[#201015]/95',
              glow: 'shadow-[0_0_20px_rgba(244,63,94,0.2)]',
              text: 'text-rose-400',
              title: 'Gagal'
            },
            info: {
              icon: Info,
              border: 'border-[#22D3EE]/40',
              bg: 'bg-[#0A1626]/95',
              glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]',
              text: 'text-[#22D3EE]',
              title: 'Informasi'
            }
          }[toast.type];

          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl backdrop-blur-xl border ${config.border} ${config.bg} ${config.glow} animate-in slide-in-from-bottom-5 fade-in duration-200 transition-all`}
            >
              <div className={`p-1 rounded-lg ${config.text} shrink-0 mt-0.5`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>
                  {toast.title || config.title}
                </h4>
                <p className="text-sm text-[#F8FAFC] mt-0.5 break-words font-medium leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback during prerendering / SSR
    return {
      showToast: (message: string, type?: ToastType, title?: string) => {
        if (typeof window !== 'undefined') {
          console.log(`[Toast ${type || 'info'}]: ${title ? title + ' - ' : ''}${message}`);
        }
      }
    };
  }
  return context;
}
