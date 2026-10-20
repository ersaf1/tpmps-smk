import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, Eye, FileText, Maximize, Minus, Plus, RefreshCw, ChevronLeft, ChevronRight, Scan } from 'lucide-react';
import { db } from './client';
import { bytes, type Doc } from './domain';
import { previewKind, officeExtension } from '../../shared/preview.mjs';
import { ContentReader } from './ContentReader';
import { FileIcon } from './FileIcon';
import { readDownload } from './read-download';
import { remoteFile, type RemoteFile } from './remote-file';
import { loadPdf, loadOffice, loadSpreadsheet } from './preview-loaders';
import { ReaderBoundary } from './ReaderBoundary';
const PdfReader = lazy(loadPdf);
const SpreadsheetReader = lazy(loadSpreadsheet);
const OfficeReader = lazy(loadOffice);

type Source = { url: string; blob?: Blob; remote?: RemoteFile; kind: string };
export function FileViewer({ file, close, download, busy }: {
  file: Doc; close: () => void; download: () => void; busy: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [source, setSource] = useState<Source | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [fit, setFit] = useState<'width' | 'page'>('width');
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [navigation, setNavigation] = useState({ page: 1, nonce: 0 });
  const [mediaError, setMediaError] = useState(false);
  const [progress, setProgress] = useState<number | null>(0);
  const [received, setReceived] = useState(0);
  const [stage, setStage] = useState('Menghubungkan ke penyimpanan');
  const [fullLayout, setFullLayout] = useState(false);
  const kind = previewKind(file.name, file.mime_type);
  const quickOffice = kind === 'office' && /^(docx|docm|dotx|dotm|pptx|pptm|ppsx|ppsm|potx|potm)$/.test(officeExtension(file.name, file.mime_type) || '');
  const converting = kind === 'office' && (!quickOffice || fullLayout);
  const pdf = source?.kind === 'pdf';
  const zoomable = pdf || kind === 'image';
  const slide = /\.(pptx?|ppsx?|odp|pptm|potx?)$/i.test(file.name);

  useLayoutEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const node = dialog.current;
    document.body.style.overflow = 'hidden';
    if (node && !node.open) node.showModal();
    return () => {
      node?.close();
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl = '';
    setSource(null); setError(''); setMediaError(false);
    setPages(0); setPage(1); setZoom(100);
    setProgress(converting ? null : 0); setReceived(0);
    setStage(converting ? 'Mengonversi dokumen Office' : 'Menghubungkan ke penyimpanan');
    const timeout = window.setTimeout(() => {
      setError('Proses terlalu lama. Periksa koneksi lalu coba lagi.'); controller.abort();
    }, converting ? 240_000 : 120_000);
    void (async () => {
      try {
        if (!converting && ['pdf', 'text', 'binary', 'image', 'audio', 'video'].includes(kind)) {
          const remote = await remoteFile(file.object_key, file.size);
          if (controller.signal.aborted) return;
          let url = remote.url;
          if (['image', 'audio', 'video'].includes(kind)) {
            const { data, error } = await db.storage.from('tpmps-documents').createSignedUrl(file.object_key, 300);
            if (error || !data) throw new Error('Dokumen tidak dapat dibaca dengan akses akun ini.');
            if (controller.signal.aborted) return;
            url = data.signedUrl;
          }
          setStage('Memuat bagian yang diperlukan');
          setSource({ url, remote, kind });
          return;
        }
        let blob: Blob;
        let renderKind: string = kind;
        if (converting) {
          const { data: session } = await db.auth.getSession();
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/preview?id=${encodeURIComponent(file.id)}`, {
            headers: { Authorization: `Bearer ${session.session?.access_token || ''}` },
            signal: controller.signal,
          });
          if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.error || 'Dokumen belum dapat dikonversi. Coba lagi.');
          }
          setStage('Mengunduh hasil pratinjau');
          if (!response.body) throw new Error('Hasil pratinjau kosong. Coba lagi.');
          blob = await readDownload(response.body, Number(response.headers.get('content-length')) || 0,
            response.headers.get('content-type') || '', (count, percent) => { setReceived(count); setProgress(percent); }, controller.signal);
          if (!blob.type.startsWith('application/pdf')) throw new Error('Hasil pratinjau tidak sesuai format PDF.');
          renderKind = 'pdf';
        } else {
          if (quickOffice) renderKind = 'office-quick';
          const { data, error: storageError } = await db.storage.from('tpmps-documents')
            .download(file.object_key, {}, { signal: controller.signal }).asStream();
          if (controller.signal.aborted) return;
          if (storageError || !data) {
            const status = storageError && 'statusCode' in storageError ? Number(storageError.statusCode) : 0;
            throw new Error(status === 401 || status === 403 ? 'Sesi berakhir atau akses ditolak. Masuk ulang dengan akun yang memiliki izin.'
              : status === 404 ? 'File tidak ditemukan di penyimpanan.'
              : 'Koneksi ke penyimpanan gagal. Periksa internet atau pemblokiran browser, lalu coba lagi.');
          }
          setStage('Mengunduh dokumen');
          blob = await readDownload(data, file.size, renderKind === 'pdf' ? 'application/pdf' : file.mime_type || 'application/octet-stream',
            (count, percent) => { setReceived(count); setProgress(percent); }, controller.signal);
        }
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setProgress(null); setStage('Unduhan selesai. Menyiapkan reader');
        setSource({ url: objectUrl, blob, kind: renderKind });
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof TypeError ? 'Koneksi ke penyimpanan gagal. Periksa internet atau pemblokiran browser, lalu coba lagi.'
          : cause instanceof Error ? cause.message : 'Dokumen belum dapat dimuat. Coba lagi.');
      }
      finally { clearTimeout(timeout); }
    })();
    return () => { clearTimeout(timeout); controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [file.id, file.object_key, file.mime_type, kind, retry, converting, quickOffice]);
  function jump(next: number) {
    const target = Math.max(1, Math.min(pages, next));
    setPage(target);
    setNavigation(old => ({ page: target, nonce: old.nonce + 1 }));
  }
  const loading = <div className="viewer-state" role="status"><FileIcon name={file.name} mime={file.mime_type} size={48} />
    <strong>{stage}{progress !== null ? ` · ${progress}%` : '…'}</strong>
    <progress className="preview-progress" aria-label={stage} max={100} value={progress ?? undefined} />
    <small>{received > 0 ? `${bytes(received)} diterima` : converting ? 'Konversi sedang diproses di server' : 'Menunggu respons penyimpanan'}</small></div>;
  return <dialog ref={dialog} className="file-viewer" aria-label={`Pratinjau ${file.name}`}
    onClose={() => {
      // Loading/revealing a lazy reader must not dismiss the parent dialog.
      const node = dialog.current;
      requestAnimationFrame(() => { if (node?.isConnected && !node.open) node.showModal(); });
    }}
    onCancel={event => { event.preventDefault(); close(); }}>
    <header className="viewer-toolbar">
      <button autoFocus className="icon-button" onClick={close} aria-label="Tutup pratinjau" title="Kembali ke dokumen"><ArrowLeft size={20} /></button>
      <FileIcon name={file.name} mime={file.mime_type} />
      <div className="viewer-name"><strong title={file.name}>{file.name}</strong><small>{bytes(file.size)}{kind === 'office' ? ' · Pratinjau dokumen' : ''}</small></div>
      <span className="viewer-readonly" tabIndex={0} title="Pratinjau hanya lihat" aria-label="Pratinjau hanya lihat"><Eye size={18} /></span>
      {quickOffice && <button className="office-layout-toggle" onClick={() => setFullLayout(!fullLayout)}>{fullLayout ? 'Tampilan cepat' : 'Tata letak lengkap'}</button>}
      {zoomable && source && <div className="viewer-zoom">
        <button className="icon-button" aria-label={kind === 'image' ? 'Perkecil gambar' : 'Perkecil dokumen'} disabled={zoom <= 50} onClick={() => setZoom(Math.max(50, zoom - 25))}><Minus size={18} /></button>
        <output aria-live="polite">{zoom}%</output>
        <button className="icon-button" aria-label={kind === 'image' ? 'Perbesar gambar' : 'Perbesar dokumen'} disabled={zoom >= 300} onClick={() => setZoom(Math.min(300, zoom + 25))}><Plus size={18} /></button>
        <button className="icon-button" aria-label={kind === 'image' ? 'Sesuaikan gambar ke layar' : 'Sesuaikan lebar dokumen'} title="Sesuaikan lebar" onClick={() => { setFit('width'); setZoom(100); }}><Maximize size={18} /></button>
        {pdf && <button className="icon-button" aria-label="Sesuaikan halaman ke layar" title="Tampilkan satu halaman penuh" onClick={() => { setFit('page'); setZoom(100); }}><Scan size={18} /></button>}
      </div>}
      <button className="viewer-download" onClick={download} disabled={busy} aria-label="Unduh dokumen" title="Unduh file asli"><Download size={18} /><span>{busy ? 'Mengunduh…' : 'Unduh'}</span></button>
    </header>
    {quickOffice && !fullLayout && <div className="office-mode-note">Tampilan cepat untuk membaca isi dokumen. Pilih “Tata letak lengkap” untuk format halaman, diagram, dan desain slide.</div>}
    {pdf && pages > 0 && <div className="viewer-page-controls">
      <button className="icon-button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => jump(page - 1)}><ChevronLeft size={18} /></button>
      <span>{slide ? 'Slide' : 'Halaman'}</span>
      <input aria-label="Nomor halaman" type="number" min={1} max={pages} value={page} onChange={event => { const value = Number(event.target.value); if (value >= 1 && value <= pages) jump(value); }} />
      <span>dari {pages}</span>
      <button className="icon-button" aria-label="Halaman berikutnya" disabled={page >= pages} onClick={() => jump(page + 1)}><ChevronRight size={18} /></button>
    </div>}
    <div className={`viewer-content${pdf ? ' viewer-pdf' : ''}`}>
      {error ? <div className="viewer-state" role="alert"><FileText size={40} /><h2>Dokumen belum dapat dibuka</h2><p>{error}</p><div className="viewer-error-actions" style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}><button onClick={() => setRetry(retry + 1)}><RefreshCw size={17} />Coba lagi</button><button className="primary" disabled={busy} onClick={download}><Download size={18} />Unduh file asli</button></div></div>
        : <ReaderBoundary onError={setError}>{!source ? loading
        : source.kind === 'office-quick' ? <Suspense fallback={loading}><OfficeReader blob={source.blob!} onError={setError} /></Suspense>
        : pdf ? <Suspense fallback={loading}><PdfReader blob={source.blob} remote={source.remote} zoom={zoom} fit={fit} navigation={navigation} onPages={setPages} onPage={setPage} onError={setError}
          onProgress={(count, total) => { setReceived(count); setProgress(total > 0 ? Math.min(100, Math.floor(count / total * 100)) : null); }} /></Suspense>
        : kind === 'spreadsheet' ? <Suspense fallback={loading}><SpreadsheetReader blob={source.blob!} onError={setError} /></Suspense>
        : kind === 'image' && !mediaError ? <div className="viewer-image-scroll"><img src={source.url} alt={file.name} onError={() => setMediaError(true)} style={{ width: `${zoom}%`, maxWidth: 'none' }} /></div>
        : (kind === 'audio' || kind === 'video') && !mediaError ? <div className="viewer-media">{kind === 'audio'
          ? <audio controls preload="metadata" src={source.url} onError={() => setMediaError(true)} aria-label={file.name} />
          : <video controls preload="metadata" playsInline src={source.url} onError={() => setMediaError(true)} aria-label={file.name} />}</div>
        : <>{mediaError && <p className="media-error" role="alert">Browser tidak dapat menampilkan media ini. Isi file tersedia di bawah.</p>}<ContentReader blob={source.blob} remote={source.remote} binary={kind !== 'text'} onError={setError} /></>}</ReaderBoundary>}
    </div>
  </dialog>;
}
