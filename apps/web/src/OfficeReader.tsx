import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Run = { text?: string; image?: string; bold?: boolean; italic?: boolean; underline?: boolean };
type Paragraph = { kind: 'paragraph'; runs: Run[]; heading?: boolean; align?: 'left' | 'center' | 'right' | 'justify' };
type Block = Paragraph | { kind: 'table'; rows: Paragraph[][][] };
type Page = { title: string; blocks: Block[] };
const elements = (node: Element, name: string) => Array.from(node.getElementsByTagNameNS('*', name));
const attribute = (node: Element | undefined, name: string) => node ? Array.from(node.attributes).find(attr => attr.localName === name)?.value || '' : '';
function xml(source: string) {
  const result = new DOMParser().parseFromString(source, 'application/xml');
  if (result.getElementsByTagName('parsererror').length || result.doctype) throw new Error('Struktur dokumen tidak valid. Gunakan tata letak lengkap.');
  return result.documentElement;
}
function relationshipPath(part: string, target: string) {
  const segments = target.startsWith('/') ? [] : part.split('/').slice(0, -1);
  for (const item of target.split('/')) {
    if (item === '..') segments.pop();
    else if (item && item !== '.') segments.push(item);
  }
  return segments.join('/');
}
function relationships(part: string, sources: Record<string, string>) {
  const parts = part.split('/'); const filename = parts.pop();
  const source = sources[`${parts.join('/')}/_rels/${filename}.rels`];
  return source ? new Map(elements(xml(source), 'Relationship')
    .filter(node => attribute(node, 'TargetMode') !== 'External')
    .map(node => [attribute(node, 'Id'), relationshipPath(part, attribute(node, 'Target'))])) : new Map<string, string>();
}
function paragraph(node: Element, rels: Map<string, string>, images: Record<string, string>): Paragraph {
  const runs: Run[] = [];
  for (const run of elements(node, 'r')) {
    const text = Array.from(run.getElementsByTagName('*')).map(child => child.localName === 't' ? child.textContent || ''
      : child.localName === 'br' ? '\n' : child.localName === 'tab' ? '\t' : '').join('');
    if (text) runs.push({ text, bold: elements(run, 'b').some(child => attribute(child, 'val') !== '0'),
      italic: elements(run, 'i').some(child => attribute(child, 'val') !== '0'), underline: elements(run, 'u').length > 0 });
  }
  for (const picture of elements(node, 'blip')) {
    const path = rels.get(attribute(picture, 'embed'));
    if (path && images[path]) runs.push({ image: images[path] });
  }
  const style = attribute(elements(node, 'pStyle')[0], 'val');
  const alignment = attribute(elements(node, 'jc')[0], 'val');
  return { kind: 'paragraph', runs, heading: /heading|title/i.test(style),
    align: ['left', 'center', 'right', 'justify'].includes(alignment) ? alignment as Paragraph['align'] : 'left' };
}
function blocks(node: Element, rels: Map<string, string>, images: Record<string, string>): Block[] {
  const result: Block[] = [];
  for (const child of Array.from(node.children)) {
    if (child.localName === 'p') result.push(paragraph(child, rels, images));
    else if (child.localName === 'tbl') result.push({ kind: 'table', rows: Array.from(child.children)
      .filter(row => row.localName === 'tr').map(row => Array.from(row.children).filter(cell => cell.localName === 'tc')
        .map(cell => elements(cell, 'p').map(item => paragraph(item, rels, images)))) });
  }
  return result;
}
function ParagraphView({ value }: { value: Paragraph }) {
  return <p className={value.heading ? 'office-heading' : ''} style={{ textAlign: value.align }}>{value.runs.map((run, index) => run.image
    ? <img key={index} src={run.image} alt="Gambar dalam dokumen" loading="lazy" />
    : <span key={index} style={{ fontWeight: run.bold ? 700 : undefined, fontStyle: run.italic ? 'italic' : undefined,
      textDecoration: run.underline ? 'underline' : undefined }}>{run.text}</span>)}</p>;
}
export default function OfficeReader({ blob, onError }: { blob: Blob; onError: (message: string) => void }) {
  const [pages, setPages] = useState<Page[]>([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    let disposed = false;
    const urls: string[] = [];
    const worker = new Worker(new URL('./office.worker.ts', import.meta.url), { type: 'module' });
    const timer = window.setTimeout(() => { worker.terminate(); if (!disposed) onError('Pembacaan dokumen terlalu lama. Gunakan tata letak lengkap.'); }, 20_000);
    setPages([]); setIndex(0);
    worker.onmessage = event => {
      clearTimeout(timer);
      if (disposed) return;
      try {
        if (event.data.error) throw new Error(event.data.error);
        const sources: Record<string, string> = event.data.xml;
        const images: Record<string, string> = {};
        for (const [path, data] of Object.entries(event.data.images as Record<string, Uint8Array>)) {
          const ext = path.split('.').pop()?.toLowerCase();
          const url = URL.createObjectURL(new Blob([new Uint8Array(data).buffer], { type: ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}` }));
          images[path] = url; urls.push(url);
        }
        if (sources['word/document.xml']) {
          const root = xml(sources['word/document.xml']);
          const body = elements(root, 'body')[0];
          if (!body) throw new Error('Isi dokumen tidak ditemukan.');
          setPages([{ title: 'Isi dokumen', blocks: blocks(body, relationships('word/document.xml', sources), images) }]);
        } else {
          const rels = relationships('ppt/presentation.xml', sources);
          const paths = sources['ppt/presentation.xml'] ? elements(xml(sources['ppt/presentation.xml']), 'sldId')
            .map(node => rels.get(Array.from(node.attributes).find(attr => attr.localName === 'id' && attr.prefix === 'r')?.value || '')).filter((path): path is string => !!path) : [];
          if (!paths.length) throw new Error('Slide tidak ditemukan. Gunakan tata letak lengkap.');
          setPages(paths.map((path, number) => {
            const root = xml(sources[path] || ''); const rels = relationships(path, sources);
            const content: Block[] = elements(root, 'p').map(node => paragraph(node, rels, images));
            for (const picture of elements(root, 'pic')) {
              const path = rels.get(attribute(elements(picture, 'blip')[0], 'embed'));
              if (path && images[path]) content.push({ kind: 'paragraph', runs: [{ image: images[path] }] });
            }
            return { title: `Slide ${number + 1}`, blocks: content };
          }));
        }
      } catch (error) { onError(error instanceof Error ? error.message : 'Dokumen tidak dapat dibaca. Gunakan tata letak lengkap.'); }
      finally { worker.terminate(); }
    };
    worker.onerror = () => { clearTimeout(timer); worker.terminate(); if (!disposed) onError('Dokumen tidak dapat dibaca. Gunakan tata letak lengkap.'); };
    void blob.arrayBuffer().then(buffer => { if (!disposed) worker.postMessage(buffer, [buffer]); }).catch(() => { if (!disposed) onError('Isi dokumen tidak dapat dimuat.'); });
    return () => { disposed = true; clearTimeout(timer); worker.terminate(); urls.forEach(url => URL.revokeObjectURL(url)); };
  }, [blob, onError]);
  if (!pages.length) return <div className="viewer-state" role="status">Membaca isi dokumen…</div>;
  const current = pages[index];
  return <div className="office-reader">
    {pages.length > 1 && <nav className="office-pagination" aria-label="Navigasi slide">
      <button className="icon-button" aria-label="Slide sebelumnya" disabled={index === 0} onClick={() => setIndex(index - 1)}><ChevronLeft size={18} /></button>
      <span>Slide {index + 1} dari {pages.length}</span>
      <button className="icon-button" aria-label="Slide berikutnya" disabled={index === pages.length - 1} onClick={() => setIndex(index + 1)}><ChevronRight size={18} /></button>
    </nav>}
    <article className="office-paper" aria-label={current.title}>
      {current.blocks.map((block, number) => block.kind === 'paragraph' ? <ParagraphView key={number} value={block} />
        : <div key={number} className="office-table-scroll"><table><tbody>{block.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{cell.map((value, p) => <ParagraphView key={p} value={value} />)}</td>)}</tr>)}</tbody></table></div>)}
    </article>
  </div>;
}
