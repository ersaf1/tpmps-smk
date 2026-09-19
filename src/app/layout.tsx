import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastFeedback";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIGMA TPMPS - Penjaminan Mutu Pendidikan Sekolah | SMK N 2 Magelang",
  description:
    "Sistem Informasi Manajemen Penjaminan Mutu Pendidikan Sekolah (SPMI) SMK Negeri 2 Magelang berbasis 8 Standar Nasional Pendidikan, Bank Bukti Digital, dan Siklus PPEPP.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050816] text-[#F8FAFC] font-sans selection:bg-[#22D3EE]/30 selection:text-white">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
