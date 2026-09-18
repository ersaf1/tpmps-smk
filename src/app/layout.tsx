import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIGMA-TPMPS | Sistem Informasi Penjaminan Mutu Sekolah SMK",
  description: "Platform Digital Penjaminan Mutu Internal Sekolah (TPMPS) SMK Berbasis 8 Standar Nasional Pendidikan, Evaluasi Terpadu 18 Unit Kerja, dan Rencana Tindak Lanjut.",
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
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
