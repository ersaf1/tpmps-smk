import { unzipSync, strFromU8 } from 'fflate';
const worker = self as unknown as { postMessage: (message: unknown, transfer?: Transferable[]) => void };

self.onmessage = event => {
  try {
    let total = 0;
    let count = 0;
    const entries = unzipSync(new Uint8Array(event.data), { filter(entry) {
      if (!/^(word|ppt)\//.test(entry.name) || !/\.(xml|rels|png|jpe?g|gif|webp)$/i.test(entry.name)) return false;
      total += entry.originalSize; count++;
      if (total > 40_000_000 || entry.originalSize > 10_000_000 || count > 2000) throw new Error('Dokumen terlalu kompleks untuk tampilan cepat. Gunakan tata letak lengkap.');
      return true;
    } });
    const xml: Record<string, string> = {};
    const images: Record<string, Uint8Array> = {};
    for (const [name, data] of Object.entries(entries)) {
      if (/\.(xml|rels)$/.test(name)) xml[name] = strFromU8(data);
      else images[name] = data;
    }
    worker.postMessage({ xml, images }, Object.values(images).map(data => data.buffer as ArrayBuffer));
  } catch (error) {
    worker.postMessage({ error: error instanceof Error ? error.message : 'Dokumen tidak dapat dibaca langsung. Gunakan tata letak lengkap.' });
  }
};
