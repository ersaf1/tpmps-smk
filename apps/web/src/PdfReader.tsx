import { memo, useEffect, useRef, useState, type CSSProperties } from 'react';
import { getDocument, GlobalWorkerOptions, TextLayer, AnnotationMode, type PDFDocumentProxy, type RenderTask } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { RemoteFile } from './remote-file';
GlobalWorkerOptions.workerSrc = workerUrl;

type Props = {
  blob?: Blob; remote?: RemoteFile; zoom: number; fit: 'width' | 'page';
  navigation: { page: number; nonce: number };
  onPages: (count: number) => void; onPage: (page: number) => void;
  onError: (message: string) => void;
  onProgress?: (received: number, total: number) => void;
};

const PdfPage = memo(function PdfPage({ document, number, width, height, zoom, fit, near }: {
  document: PDFDocumentProxy; number: number; width: number; height: number;
  zoom: number; fit: Props['fit']; near: boolean;
}) {
  const holder = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 595, height: 842 });
  const [renderError, setRenderError] = useState(false);
  const availableWidth = Math.max(100, width - (width < 600 ? 24 : 48));
  const scale = (fit === 'page'
    ? Math.min(availableWidth / dimensions.width, Math.max(100, height - 48) / dimensions.height)
    : availableWidth / dimensions.width) * zoom / 100;
  const pageWidth = dimensions.width * scale;
  const pageHeight = dimensions.height * scale;
  useEffect(() => {
    if (!near) return;
    let disposed = false;
    let render: RenderTask | undefined;
    let layer: TextLayer | undefined;
    setRenderError(false);
    void (async () => {
      try {
        const page = await document.getPage(number);
        if (disposed || !canvas.current || !text.current) return;
        const natural = page.getViewport({ scale: 1 });
        if (dimensions.width !== natural.width || dimensions.height !== natural.height) {
          setDimensions({ width: natural.width, height: natural.height });
          return;
        }
        const viewport = page.getViewport({ scale });
        const ratio = Math.min(window.devicePixelRatio || 1, 2,
          Math.sqrt(12_000_000 / (viewport.width * viewport.height)));
        const node = canvas.current;
        node.width = Math.ceil(viewport.width * ratio);
        node.height = Math.ceil(viewport.height * ratio);
        render = page.render({ canvas: node, viewport,
          transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
          annotationMode: AnnotationMode.DISABLE });
        await render.promise;
        if (disposed || !text.current) return;
        text.current.replaceChildren();
        layer = new TextLayer({ container: text.current, viewport, textContentSource: page.streamTextContent() });
        await layer.render();
      } catch (error) {
        if (!disposed && !(error instanceof Error && error.name === 'RenderingCancelledException')) setRenderError(true);
      }
    })();
    return () => { disposed = true; render?.cancel(); layer?.cancel(); };
  }, [document, number, near, scale, dimensions.width, dimensions.height]);
  return <section ref={holder} className="pdf-page" data-page-number={number}
    aria-label={`Halaman ${number}`} style={{ width: pageWidth, height: pageHeight,
      '--scale-factor': scale, '--total-scale-factor': scale, '--user-unit': 1 } as CSSProperties}>
    {near && !renderError ? <><canvas ref={canvas} aria-hidden="true" /><div ref={text} className="textLayer" /></>
      : <div className="pdf-page-placeholder">{renderError ? 'Halaman ini tidak dapat dirender.' : `Halaman ${number}`}</div>}
  </section>;
});

export default function PdfReader({ blob, remote, zoom, fit, navigation, onPages, onPage, onError, onProgress }: Props) {
  const scroll = useRef<HTMLDivElement>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [progress, setProgress] = useState<number | null>(0);
  const [nearPages, setNearPages] = useState(new Set([1]));
  // Callbacks should not restart parsing the document when parent state updates.
  const callbacks = useRef({ onPages, onPage, onError, onProgress });
  callbacks.current = { onPages, onPage, onError, onProgress };
  useEffect(() => {
    let disposed = false;
    let task: ReturnType<typeof getDocument> | undefined;
    setDocument(null);
    setNearPages(new Set([1]));
    void (async () => {
      try {
        const data = blob ? new Uint8Array(await blob.arrayBuffer()) : undefined;
        if (disposed) return;
        task = getDocument({ ...(remote ? { url: remote.url, httpHeaders: remote.headers,
          disableAutoFetch: true, disableStream: true, rangeChunkSize: 65_536 } : { data }), enableXfa: false,
          cMapUrl: '/pdfjs/cmaps/', cMapPacked: true,
          standardFontDataUrl: '/pdfjs/standard_fonts/', wasmUrl: '/pdfjs/wasm/' });
        task.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
          setProgress(total > 0 ? Math.min(100, Math.floor(loaded / total * 100)) : null);
          callbacks.current.onProgress?.(loaded, total);
        };
        const pdf = await task.promise;
        if (disposed) return;
        setDocument(pdf);
        callbacks.current.onPages(pdf.numPages);
      } catch (error) {
        if (!disposed) callbacks.current.onError(error instanceof Error && error.name === 'PasswordException'
          ? 'Dokumen dilindungi kata sandi. Gunakan salinan yang dapat dibaca untuk pratinjau.'
          : 'Dokumen tidak dapat dirender. File mungkin rusak atau tidak sesuai formatnya.');
      }
    })();
    return () => { disposed = true; void task?.destroy(); };
  }, [blob, remote]);
  useEffect(() => {
    if (!document || !scroll.current) return;
    const observer = new IntersectionObserver(entries => setNearPages(previous => {
      const next = new Set(previous);
      for (const entry of entries) {
        const page = Number((entry.target as HTMLElement).dataset.pageNumber);
        if (entry.isIntersecting) next.add(page); else next.delete(page);
      }
      return next;
    }), { root: scroll.current, rootMargin: '600px 0px' });
    scroll.current.querySelectorAll('.pdf-page').forEach(page => observer.observe(page));
    return () => observer.disconnect();
  }, [document]);
  useEffect(() => {
    const node = scroll.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setSize({ width: node.clientWidth, height: node.clientHeight }));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!document || !scroll.current) return;
    const node = scroll.current;
    const visibility = new Map<Element, boolean>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) visibility.set(entry.target, entry.isIntersecting && entry.intersectionRatio > .05);
      // Observer callbacks contain only changed entries, not every visible page.
      const visible = [...visibility].filter(([, shown]) => shown)
        .map(([element]) => element as HTMLElement)
        .sort((a, b) => Number(a.dataset.pageNumber) - Number(b.dataset.pageNumber));
      if (visible[0]) callbacks.current.onPage(Number(visible[0].dataset.pageNumber));
    }, { root: node, threshold: [0, .2, .5, .8] });
    node.querySelectorAll('.pdf-page').forEach(page => observer.observe(page));
    return () => observer.disconnect();
  }, [document, size.width]);
  useEffect(() => {
    if (!document || !navigation.nonce) return;
    const node = scroll.current;
    const target = node?.querySelector<HTMLElement>(`[data-page-number="${navigation.page}"]`);
    if (node && target) node.scrollTo({ top: target.offsetTop - 16,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [document, navigation]);
  return <div ref={scroll} className="pdf-scroll" tabIndex={0} aria-label="Isi dokumen, dapat digulir">
    {!document ? <div className="viewer-state" role="status"><p>Menyiapkan halaman{progress !== null ? ` · ${progress}%` : '…'}</p><progress className="preview-progress" max={100} value={progress ?? undefined} aria-label="Memuat halaman PDF" /></div>
      : <div className="pdf-pages">{Array.from({ length: document.numPages }, (_, i) =>
        <PdfPage key={i + 1} document={document} number={i + 1} width={size.width} height={size.height}
          zoom={zoom} fit={fit} near={nearPages.has(i + 1)} />)}</div>}
  </div>;
}
