import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Table2 } from 'lucide-react';
import type { SheetInfo, SheetWindow } from './spreadsheet.worker';

export default function SpreadsheetReader({ blob, onError }: { blob: Blob; onError: (message: string) => void }) {
  const worker = useRef<Worker | null>(null);
  const nextId = useRef(0);
  const pendingWindow = useRef(0);
  const errorCallback = useRef(onError);
  errorCallback.current = onError;
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [sheet, setSheet] = useState(0);
  const [rowPage, setRowPage] = useState(0);
  const [columnPage, setColumnPage] = useState(0);
  const [data, setData] = useState<SheetWindow | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{ r: number; c: number; value: string } | null>(null);
  useEffect(() => {
    let disposed = false;
    const parser = new Worker(new URL('./spreadsheet.worker.ts', import.meta.url), { type: 'module' });
    worker.current = parser;
    const timeout = window.setTimeout(() => {
      parser.terminate();
      if (!disposed) errorCallback.current('Pembacaan spreadsheet terlalu lama. Periksa file atau coba lagi.');
    }, 90_000);
    parser.onmessage = event => {
      if (disposed) return;
      const reply = event.data;
      if (reply.error) { clearTimeout(timeout); errorCallback.current(reply.error); }
      else if (reply.sheets) { clearTimeout(timeout); setSheets(reply.sheets); if (!reply.sheets.length) setLoading(false); }
      else if (reply.window && reply.id === pendingWindow.current) { setData(reply.window); setLoading(false); }
    };
    parser.onerror = () => { clearTimeout(timeout); if (!disposed) errorCallback.current('Spreadsheet tidak dapat dibuka di browser ini. Coba lagi.'); };
    void blob.arrayBuffer().then(buffer => {
      if (!disposed) parser.postMessage({ type: 'load', id: ++nextId.current, buffer }, [buffer]);
    }).catch(() => { if (!disposed) errorCallback.current('Isi spreadsheet tidak dapat dimuat.'); });
    return () => { disposed = true; clearTimeout(timeout); parser.terminate(); worker.current = null; };
  }, [blob]);
  useEffect(() => {
    if (!sheets.length || !worker.current) return;
    setLoading(true); setSelected(null);
    const id = ++nextId.current;
    pendingWindow.current = id;
    worker.current.postMessage({ type: 'window', id, sheet, row: rowPage * 200, column: columnPage * 40 });
  }, [sheets, sheet, rowPage, columnPage]);
  const info = sheets[sheet];
  function choose(index: number) { setSheet(index); setRowPage(0); setColumnPage(0); }
  return <div className="spreadsheet-reader">
    <div className="sheet-tabs" role="tablist" aria-label="Sheet spreadsheet">
      {sheets.map((item, index) => <button key={item.name} role="tab" id={`sheet-tab-${index}`} aria-controls="sheet-panel"
        aria-selected={sheet === index} tabIndex={sheet === index ? 0 : -1} onClick={() => choose(index)}
        onKeyDown={event => { if (!['ArrowLeft','ArrowRight'].includes(event.key)) return; event.preventDefault();
          const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + sheets.length) % sheets.length;
          choose(next); (event.currentTarget.parentElement?.children[next] as HTMLElement)?.focus(); }}>
        <Table2 size={15} />{item.name}
      </button>)}
    </div>
    <div className="sheet-inspector"><span>{selected && data ? `${data.columns[selected.c]}${data.row + selected.r + 1}` : 'Sel'}</span>
      <output title={selected?.value}>{selected ? selected.value || '(kosong)' : 'Pilih sel untuk melihat nilainya.'}</output></div>
    <div className="sheet-scroll" id="sheet-panel" role="tabpanel" aria-labelledby={`sheet-tab-${sheet}`} tabIndex={0}>
      {loading ? <div className="viewer-state" role="status"><div className="viewer-skeleton" /><p>Membaca spreadsheet…</p></div>
        : !data?.values.length ? <div className="viewer-state">Sheet ini kosong.</div>
        : <table className="sheet-grid" role="grid" aria-label={`Isi sheet ${info?.name}`}>
          <thead><tr role="row"><th aria-label="Nomor baris" />{data.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>{data.values.map((row, r) => <tr key={r} role="row"><th scope="row">{data.row + r + 1}</th>{row.map((value, c) =>
            <td key={c} role="gridcell" aria-selected={selected?.r === r && selected.c === c}>
              <button className="sheet-cell" data-cell-row={r} data-cell-column={c} title={value}
                tabIndex={selected ? selected.r === r && selected.c === c ? 0 : -1 : r === 0 && c === 0 ? 0 : -1}
                aria-label={`${data.columns[c]}${data.row + r + 1}: ${value || 'kosong'}`} onClick={() => setSelected({ r, c, value })}
                onFocus={() => setSelected({r,c,value})}
                onKeyDown={event => {
                  const directions: Record<string, [number, number]> = { ArrowUp: [-1,0], ArrowDown: [1,0], ArrowLeft: [0,-1], ArrowRight: [0,1] };
                  const delta = directions[event.key]; if (!delta) return;
                  event.preventDefault();
                  const target = event.currentTarget.closest('table')?.querySelector<HTMLElement>(`[data-cell-row="${r + delta[0]}"][data-cell-column="${c + delta[1]}"]`);
                  target?.focus();
                }}>{value || '\u00a0'}</button>
            </td>)}</tr>)}</tbody>
        </table>}
    </div>
    {info && <div className="sheet-footer"><span>{info.rows.toLocaleString('id-ID')} baris · {info.columns.toLocaleString('id-ID')} kolom</span>
      {info.rows > 200 && <div className="reader-pagination"><button aria-label="Baris sebelumnya" disabled={!rowPage} onClick={() => setRowPage(rowPage - 1)}><ChevronLeft size={16} /></button><span>Baris {rowPage * 200 + 1}–{Math.min((rowPage + 1) * 200, info.rows)}</span><button aria-label="Baris berikutnya" disabled={(rowPage + 1) * 200 >= info.rows} onClick={() => setRowPage(rowPage + 1)}><ChevronRight size={16} /></button></div>}
      {info.columns > 40 && <div className="reader-pagination"><button aria-label="Kolom sebelumnya" disabled={!columnPage} onClick={() => setColumnPage(columnPage - 1)}><ChevronLeft size={16} /></button><span>Kolom {columnPage * 40 + 1}–{Math.min((columnPage + 1) * 40, info.columns)}</span><button aria-label="Kolom berikutnya" disabled={(columnPage + 1) * 40 >= info.columns} onClick={() => setColumnPage(columnPage + 1)}><ChevronRight size={16} /></button></div>}
    </div>}
  </div>;
}
