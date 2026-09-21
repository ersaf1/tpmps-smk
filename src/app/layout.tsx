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
  title: "SINTESA TPMPS - Penjaminan Mutu Pendidikan Sekolah | SMK N 2 Magelang",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#0077B6]/20 selection:text-[#0077B6]">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
