'use client';

import Link from 'next/link';
import { useActionState, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, File, FileText, Folder, FolderPlus, LoaderCircle, Search, Trash2, Upload } from 'lucide-react';
import { createFolderAction, createPeriodAction, deleteFileAction, deleteFolderAction, type DocumentActionState } from '@/app/actions/documentActions';
import { logoutAction } from '@/app/actions/authActions';
import { browserClient } from '@/lib/supabase/client';
import { KIND_LABELS, type AuthProfile, type FileItem, type FolderItem, type PeriodItem } from '@/types/documents';

interface UnitOption { id: string; name: string }
interface Props {
  profile: AuthProfile;
  periods: PeriodItem[];
  selectedPeriod: PeriodItem | null;
  currentFolder: FolderItem | null;
  folders: FolderItem[];
  files: FileItem[];
  units: UnitOption[];
}

const emptyState: DocumentActionState = {};
const formatBytes = (bytes: number) => bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function DocumentExplorer({ profile, periods, selectedPeriod, currentFolder, folders, files, units }: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [folderState, folderAction, folderPending] = useActionState(createFolderAction, emptyState);
  const [periodState, periodAction, periodPending] = useActionState(createPeriodAction, emptyState);
  const canWriteScope = (scope: FolderItem['scope'], unitId: string | null) =>
    profile.role === 'superadmin'
    || (profile.role === 'ketua_tpmps' && scope === 'tpmps')
    || (profile.role === 'ketua_unit' && scope === 'unit' && unitId === profile.unitId);
  const canCreateAtCurrentLocation = profile.role !== 'kepala_sekolah'
    && (!currentFolder || canWriteScope(currentFolder.scope, currentFolder.unitId));
  const canCreatePeriod = profile.role === 'superadmin' || profile.role === 'kepala_sekolah';

  const visibleFolders = useMemo(() => folders.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [folders, query]);
  const visibleFiles = useMemo(() => files.filter((item) => item.originalName.toLowerCase().includes(query.toLowerCase())), [files, query]);

  async function uploadFiles(list: FileList | null) {
    if (!list || !currentFolder || !selectedPeriod) return;
    const selectedFiles = Array.from(list);
    if (selectedFiles.length > 10) {
      setUploadMessage('Maksimal 10 file dalam sekali unggah.');
      if (fileInput.current) fileInput.current.value = '';
      return;
    }
    setUploading(true); setUploadMessage('');
    const supabase = browserClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { setUploadMessage('Sesi berakhir. Silakan login kembali.'); setUploading(false); return; }

    const errors: string[] = [];
    let uploadedCount = 0;
    for (const item of selectedFiles) {
      if (item.size === 0) { errors.push(`${item.name} kosong.`); continue; }
      if (item.size > 50 * 1024 * 1024) { errors.push(`${item.name} melebihi 50 MB.`); continue; }
      const safeName = item.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const storagePath = `${auth.user.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from('documents').upload(storagePath, item, {
        upsert: false,
        ...(item.type ? { contentType: item.type } : {})
      });
      if (uploadError) { errors.push(`Gagal mengunggah ${item.name}.`); continue; }
      const { data: entry, error: entryError } = await supabase.from('file_entries').insert({ folder_id: currentFolder.id, storage_path: storagePath, original_name: item.name, mime_type: item.type || 'application/octet-stream', size_bytes: item.size, created_by: auth.user.id }).select('id').single();
      if (entryError) { await supabase.storage.from('documents').remove([storagePath]); errors.push(`Gagal menyimpan ${item.name}.`); continue; }
      await supabase.from('audit_logs').insert({ actor_id: auth.user.id, action: 'UPLOAD_FILE', entity_type: 'file', entity_id: entry.id, details: { name: item.name } });
      uploadedCount += 1;
    }
    setUploadMessage(errors.length ? `${uploadedCount} file berhasil. ${errors.join(' ')}` : `${uploadedCount} file berhasil diunggah.`);
    setUploading(false); if (fileInput.current) fileInput.current.value = ''; router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div><h1 className="text-lg font-black text-slate-950">SINTESA <span className="text-[#0077B6]">Dokumen</span></h1><p className="text-xs text-slate-500">Arsip Mutu SMK Negeri 2 Magelang</p></div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-bold text-slate-800">{profile.fullName}</p><p className="text-xs text-slate-500">{profile.positionName}</p></div><form action={logoutAction}><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Keluar</button></form></div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1"><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Periode</label><select value={selectedPeriod?.id ?? ''} onChange={(event) => router.push(`/dashboard?period=${event.target.value}`)} className="h-11 min-w-64 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold"><option value="">Pilih periode</option>{periods.map((period) => <option key={period.id} value={period.id}>{period.name}{period.isActive ? ' • Aktif' : ''}</option>)}</select></div>
          {canCreatePeriod && <form action={periodAction} className="grid gap-2 sm:grid-cols-4"><input name="name" required placeholder="2026/2027" className="h-10 rounded-lg border border-slate-300 px-3 text-sm" /><input name="startsOn" type="date" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm" /><input name="endsOn" type="date" required className="h-10 rounded-lg border border-slate-300 px-3 text-sm" /><button disabled={periodPending} className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-bold text-white disabled:opacity-60">{periodPending ? 'Menyimpan...' : 'Buat periode'}</button>{periodState.error && <p className="text-xs text-rose-600 sm:col-span-4">{periodState.error}</p>}{periodState.success && <p className="text-xs text-emerald-600 sm:col-span-4">{periodState.success}</p>}</form>}
        </div>

        {!selectedPeriod ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center"><Folder className="mx-auto mb-4 h-12 w-12 text-slate-300" /><h2 className="font-bold text-slate-800">Belum ada periode yang dipilih</h2><p className="mt-1 text-sm text-slate-500">Pilih periode untuk membuka arsip dokumen.</p></div> : <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-sm"><Link href={`/dashboard?period=${selectedPeriod.id}`} className="font-semibold text-[#0077B6]">Dokumen</Link>{currentFolder && <><span className="text-slate-300">/</span><span className="font-bold text-slate-800">{currentFolder.name}</span></>}</div><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari folder atau file" className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm sm:w-72" /></div></div>

          {canCreateAtCurrentLocation && <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[1fr_auto]">
            <form action={folderAction} className="flex flex-col gap-2 sm:flex-row"><input type="hidden" name="periodId" value={selectedPeriod.id} /><input type="hidden" name="parentId" value={currentFolder?.id ?? ''} /><input name="name" required placeholder="Nama folder baru" className="h-10 flex-1 rounded-lg border border-slate-300 px-3 text-sm" />{!currentFolder && profile.role === 'superadmin' && <><select name="scope" className="h-10 rounded-lg border border-slate-300 px-2 text-sm"><option value="tpmps">TPMPS</option><option value="unit">Unit</option></select><select name="unitId" className="h-10 rounded-lg border border-slate-300 px-2 text-sm"><option value="">Pilih unit</option>{units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}</select></>}{!currentFolder && profile.role !== 'superadmin' && <select name="documentKind" className="h-10 rounded-lg border border-slate-300 px-2 text-sm">{(profile.role === 'ketua_tpmps' ? ['manual_mutu','prosedur_mutu','dokumen_lainnya'] : ['petunjuk_kerja','catatan_mutu']).map((kind) => <option key={kind} value={kind}>{KIND_LABELS[kind as keyof typeof KIND_LABELS]}</option>)}</select>}<button disabled={folderPending} className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0077B6] px-4 text-sm font-bold text-white disabled:opacity-60"><FolderPlus className="h-4 w-4" />Buat folder</button>{folderState.error && <span className="self-center text-xs text-rose-600">{folderState.error}</span>}</form>
            {currentFolder && <div><input ref={fileInput} type="file" multiple className="hidden" onChange={(event) => uploadFiles(event.target.files)} /><button onClick={() => fileInput.current?.click()} disabled={uploading} className="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white disabled:opacity-60">{uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Unggah file</button></div>}<p className="text-xs text-slate-500 lg:col-span-2">Semua format file diterima • maksimum 50 MB per file • maksimum 10 file sekali unggah</p>{uploadMessage && <p className="text-xs font-medium text-slate-700 lg:col-span-2">{uploadMessage}</p>}
          </div>}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="grid grid-cols-[1fr_120px_100px] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500"><span>Nama</span><span>Ukuran</span><span className="text-right">Aksi</span></div>
            {visibleFolders.map((folder) => <div key={folder.id} className="grid grid-cols-[1fr_120px_100px] items-center border-b border-slate-100 px-4 py-3 last:border-0"><Link href={`/dashboard?period=${selectedPeriod.id}&folder=${folder.id}`} className="flex min-w-0 items-center gap-3 font-semibold text-slate-800 hover:text-[#0077B6]"><Folder className="h-5 w-5 shrink-0 fill-amber-100 text-amber-500" /><span className="truncate">{folder.name}</span>{folder.unitName && <span className="hidden rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 md:inline">{folder.unitName}</span>}</Link><span className="text-xs text-slate-400">Folder</span><div className="text-right">{canWriteScope(folder.scope, folder.unitId) && <form action={deleteFolderAction}><input type="hidden" name="id" value={folder.id} /><button aria-label="Hapus folder" className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></form>}</div></div>)}
            {visibleFiles.map((item) => <div key={item.id} className="grid grid-cols-[1fr_120px_100px] items-center border-b border-slate-100 px-4 py-3 last:border-0"><div className="flex min-w-0 items-center gap-3"><FileText className="h-5 w-5 shrink-0 text-sky-600" /><span className="truncate text-sm font-medium text-slate-800">{item.originalName}</span></div><span className="text-xs text-slate-500">{formatBytes(item.sizeBytes)}</span><div className="flex justify-end gap-1"><a href={`/api/files/${item.id}/download`} aria-label="Unduh file" className="rounded-lg p-2 text-slate-400 hover:bg-sky-50 hover:text-sky-700"><Download className="h-4 w-4" /></a>{currentFolder && canWriteScope(currentFolder.scope, currentFolder.unitId) && <form action={deleteFileAction}><input type="hidden" name="id" value={item.id} /><button aria-label="Hapus file" className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></form>}</div></div>)}
            {visibleFolders.length === 0 && visibleFiles.length === 0 && <div className="py-20 text-center"><File className="mx-auto mb-3 h-10 w-10 text-slate-300" /><p className="text-sm font-semibold text-slate-600">Folder ini masih kosong</p></div>}
          </div>
        </>}
      </main>
    </div>
  );
}
