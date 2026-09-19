'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { sigmaService } from '@/lib/services/sigmaDataService';
import { UserProfile } from '@/types/sigma';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session
    const user = sigmaService.getActiveUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    setIsLoading(false);
  }, [router]);

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen w-full bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-2 border-[#22D3EE] border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-[#94A3B8] tracking-widest uppercase">
            Memuat Sistem SIGMA TPMPS...
          </span>
        </div>
      </div>
    );
  }

  // Get real review and pending document count
  const evals = sigmaService.getEvaluations();
  const docs = sigmaService.getDocuments();
  const rtlList = sigmaService.getRtlList();

  const reviewCount = evals.filter((e) => e.status === 'Diajukan' || e.status === 'Direview').length;
  const validatingDocCount = docs.filter((d) => d.status === 'Menunggu Review').length;
  const rtlActiveCount = rtlList.filter((r) => r.status === 'Sedang Berjalan').length;

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col">
      {/* Persistent Left Sidebar */}
      <Sidebar
        user={currentUser}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        reviewCount={reviewCount}
        validatingDocCount={validatingDocCount}
        rtlActiveCount={rtlActiveCount}
      />

      {/* Main Content Area (offset by sidebar width on lg screens) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen">
        <Header
          user={currentUser}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
