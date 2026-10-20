/** Read only the requested bytes, also when a gateway ignores HTTP Range. */
export async function readFileSlice(file, start, end, signal, progress, fetcher = fetch) {
  if (end <= start) return new Blob();
  const response = await fetcher(file.url, { headers: { ...file.headers, Range: `bytes=${start}-${end - 1}` }, signal });
  if (!response.ok || !response.body) throw new Error(response.status === 401 || response.status === 403
    ? 'Sesi berakhir atau akses ditolak. Masuk ulang dengan akun yang memiliki izin.' : 'Bagian file tidak dapat dimuat. Periksa koneksi lalu coba lagi.');
  let skip = start;
  if (response.status === 206) {
    const match = response.headers.get('content-range')?.match(/^bytes (\d+)-(\d+)\/(\d+|\*)$/);
    if (!match || Number(match[1]) !== start) {
      await response.body.cancel(); throw new Error('Rentang data file tidak sesuai. Coba lagi.');
    }
    skip = 0;
  }
  const reader = response.body.getReader();
  const chunks = [];
  let remaining = end - start;
  const wanted = remaining;
  let previous = -1;
  try {
    while (remaining > 0) {
      const { done, value } = await reader.read();
      if (signal.aborted) throw new globalThis.DOMException('Dibatalkan', 'AbortError');
      if (done) break;
      if (skip >= value.byteLength) { skip -= value.byteLength; continue; }
      const piece = value.subarray(skip, skip + remaining);
      skip = 0; remaining -= piece.byteLength;
      chunks.push(new Uint8Array(piece).buffer);
      const percent = Math.floor((wanted - remaining) / wanted * 100);
      if (percent !== previous) { previous = percent; progress(percent); }
    }
    return new Blob(chunks);
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}
