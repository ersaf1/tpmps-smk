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
              border: 'border-emerald-200',
              bg: 'bg-white',
              glow: 'shadow-lg shadow-emerald-500/10',
              text: 'text-emerald-600',
              title: 'Berhasil'
            },
            warning: {
              icon: AlertTriangle,
              border: 'border-amber-200',
              bg: 'bg-white',
              glow: 'shadow-lg shadow-amber-500/10',
              text: 'text-amber-600',
              title: 'Perhatian'
            },
            error: {
              icon: XCircle,
              border: 'border-rose-200',
              bg: 'bg-white',
              glow: 'shadow-lg shadow-rose-500/10',
              text: 'text-rose-600',
              title: 'Gagal'
            },
            info: {
              icon: Info,
              border: 'border-sky-200',
              bg: 'bg-white',
              glow: 'shadow-lg shadow-sky-500/10',
              text: 'text-[#0077B6]',
              title: 'Informasi'
            }
          }[toast.type];

          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${config.border} ${config.bg} ${config.glow} animate-in slide-in-from-bottom-5 fade-in duration-200 transition-all`}
            >
              <div className={`p-1 rounded-lg ${config.text} shrink-0 mt-0.5`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>
                  {toast.title || config.title}
                </h4>
                <p className="text-sm text-slate-800 mt-0.5 break-words font-medium leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 shrink-0 cursor-pointer"
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
