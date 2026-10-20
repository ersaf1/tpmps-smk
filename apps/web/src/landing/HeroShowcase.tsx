import { Folder, ShieldCheck, LockKeyhole, CalendarDays, ChevronDown } from "lucide-react";

export function HeroShowcase({ theme }: { theme: "dark" | "light" }) {
  return <div className="sintesa-structure" data-theme={theme} aria-label="Struktur dokumen SINTESA">
    <div className="structure-brand"><img src="/school-logo.png" alt="Logo SMK Negeri 2 Magelang" /><div><span>SMK NEGERI 2 MAGELANG</span><h2>Ruang dokumen mutu</h2></div></div>
    <p>Dokumen tersusun menurut periode dan penanggung jawab.</p>
    <div className="structure-section"><ShieldCheck size={20} /><div><h3>Ketua TPMPS</h3><span>Dokumen mutu sekolah</span></div></div>
    <div className="structure-folders"><details><summary><Folder size={20} />Manual Mutu <b>MM</b><ChevronDown size={16} /></summary><p>Pedoman dan kebijakan mutu sekolah. Dikelola oleh ketua TPMPS.</p></details><details><summary><Folder size={20} />Prosedur Mutu <b>PM</b><ChevronDown size={16} /></summary><p>Prosedur pelaksanaan penjaminan mutu. Pilih periode untuk membaca arsipnya.</p></details></div>
    <div className="structure-section"><Folder size={20} /><div><h3>Unit kerja</h3><span>Dokumen masing-masing unit</span></div></div>
    <div className="structure-folders"><details><summary><Folder size={20} />Catatan Mutu <b>CM</b><ChevronDown size={16} /></summary><p>Catatan pelaksanaan kegiatan mutu, tersusun dalam ruang masing-masing unit kerja.</p></details><details><summary><Folder size={20} />Petunjuk Kerja <b>PK</b><ChevronDown size={16} /></summary><p>Petunjuk pekerjaan di unit. Unggah dan kelola sesuai penugasan akun.</p></details></div>
    <div className="structure-note"><CalendarDays size={16} />Arsip per periode<LockKeyhole size={16} />Akses sesuai peran</div>
  </div>;
}
