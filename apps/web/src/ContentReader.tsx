import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { bytes } from './domain';
import { readFileSlice, type RemoteFile } from './remote-file';

/** Paginated, escaped content: even large text/binary files stay scrollable. */
export function ContentReader({ blob, remote, binary = false, onReady, onError }: { blob?: Blob; remote?: RemoteFile; binary?: boolean; onReady?: () => void; onError?: (message: string) => void }) {
  const chunkSize = binary ? 16_384 : 256_000;
  const [part, setPart] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [percent, setPercent] = useState(0);
  const [retry, setRetry] = useState(0);
  const size = blob?.size ?? remote?.size ?? 0;
  const parts = Math.max(1, Math.ceil(size / chunkSize));
  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => { controller.abort(); if (!disposed) { setError('Koneksi terlalu lama. Coba lagi.'); setLoading(false); } }, 30_000);
    setLoading(true); setError(''); setPercent(0);
    void (async () => {
      try {
        const offset = part * chunkSize;
        const slice = blob ? blob.slice(offset, offset + chunkSize) : remote
          ? await readFileSlice(remote, offset, Math.min(size, offset + chunkSize), controller.signal, value => { if (!disposed) setPercent(value); }) : new Blob();
        let value;
        if (binary) {
          const data = new Uint8Array(await slice.arrayBuffer());
          const lines: string[] = [];
          for (let row = 0; row < data.length; row += 16) {
            const values = Array.from(data.subarray(row, row + 16));
            const hex = values.map(byte => byte.toString(16).padStart(2, '0')).join(' ').padEnd(47, ' ');
            const ascii = values.map(byte => byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.').join('');
            lines.push(`${(offset + row).toString(16).padStart(8, '0')}  ${hex}  ${ascii}`);
          }
          value = lines.join('\n');
        } else value = await slice.text();
        if (!disposed && !controller.signal.aborted) { setContent(value); setLoading(false); onReady?.(); }
      } catch {
        if (!disposed && !controller.signal.aborted) { const message = 'Koneksi ke penyimpanan gagal. Periksa internet lalu coba lagi.'; setError(message); setLoading(false); onError?.(message); }
      }
      finally { clearTimeout(timeout); }
    })();
    return () => { disposed = true; clearTimeout(timeout); controller.abort(); };
  }, [blob, remote, size, part, chunkSize, binary, onReady, onError, retry]);
  return <div className="content-reader">
    <div className="content-reader-toolbar">
      <span>{binary ? 'Isi biner · HEX / ASCII' : 'Teks dokumen'}<small>{bytes(size)}{parts > 1 ? ` · Bagian ${part + 1} dari ${parts}` : ''}</small></span>
      {parts > 1 && <div className="reader-pagination">
        <button aria-label="Bagian sebelumnya" disabled={!part} onClick={() => setPart(part - 1)}><ChevronLeft size={18} /></button>
        <button aria-label="Bagian berikutnya" disabled={part + 1 >= parts} onClick={() => setPart(part + 1)}><ChevronRight size={18} /></button>
      </div>}
    </div>
    {binary && <p className="binary-explanation">File ini ditampilkan sebagai isi byte. Unduh untuk membukanya dengan aplikasi asal.</p>}
    {loading ? <div className="viewer-state" role="status">Memuat bagian {part + 1} · {percent}%<progress className="preview-progress" max={100} value={percent} aria-label="Memuat bagian file" /></div>
      : error ? <div className="viewer-state" role="alert"><p className="error">{error}</p><button onClick={() => setRetry(retry + 1)}>Coba lagi</button></div>
      : content ? <pre className={`viewer-text${binary ? ' viewer-hex' : ''}`}>{content}</pre>
      : <div className="viewer-state">File ini kosong.</div>}
  </div>;
}
