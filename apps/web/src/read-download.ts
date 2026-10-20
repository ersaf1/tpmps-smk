export async function readDownload(stream: ReadableStream<Uint8Array>, total: number, type: string,
  onProgress: (received: number, percent: number | null) => void, signal: AbortSignal): Promise<Blob> {
  const reader = stream.getReader();
  const chunks: BlobPart[] = [];
  let received = 0;
  let previous = -1;
  const cancel = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener('abort', cancel, { once: true });
  try {
    if (signal.aborted) throw new DOMException('Dibatalkan', 'AbortError');
    for (;;) {
      const { done, value } = await reader.read();
      if (signal.aborted) throw new DOMException('Dibatalkan', 'AbortError');
      if (done) break;
      chunks.push(new Uint8Array(value).buffer);
      received += value.byteLength;
      const percent = total > 0 ? Math.min(99, Math.floor(received / total * 100)) : null;
      if (percent !== previous || percent === null) { onProgress(received, percent); previous = percent ?? -1; }
    }
    onProgress(received, 100);
    return new Blob(chunks, { type });
  } finally { signal.removeEventListener('abort', cancel); reader.releaseLock(); }
}
