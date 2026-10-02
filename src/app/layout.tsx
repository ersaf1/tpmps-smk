import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastFeedback";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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
      className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#0077B6]/20 selection:text-[#0077B6]">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
