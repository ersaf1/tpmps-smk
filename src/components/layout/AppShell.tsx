'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { sintesaService } from '@/lib/services/sintesaDataService';
import { UserProfile } from '@/types/sintesa';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const router = useRouter();
  const [currentUser] = useState<UserProfile | null>(() => sintesaService.getActiveUser());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-3 border-[#0077B6] border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
            Memuat Sistem Mutu...
          </span>
        </div>
      </div>
    );
  }

  // Get real review and pending document count
  const evals = sintesaService.getEvaluations();
  const docs = sintesaService.getDocuments();
  const rtlList = sintesaService.getRtlList();

  const reviewCount = evals.filter((e) => e.status === 'Diajukan' || e.status === 'Direview').length;
  const validatingDocCount = docs.filter((d) => d.status === 'Menunggu Review').length;
  const rtlActiveCount = rtlList.filter((r) => r.status === 'Sedang Berjalan').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Persistent Left Sidebar (Clean White & Blue) */}
      <Sidebar
        user={currentUser}
        isOpenMobile={isMobileSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        reviewCount={reviewCount}
        validatingDocCount={validatingDocCount}
        rtlActiveCount={rtlActiveCount}
      />

      {/* Main Content Area */}
      <div className={`${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'} flex-1 flex flex-col min-h-screen transition-[padding] duration-300`}>
        <Header
          user={currentUser}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
