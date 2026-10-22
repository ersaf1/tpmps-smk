import { unzipSync, strFromU8 } from 'fflate';
const worker = self as unknown as { postMessage: (message: unknown, transfer?: Transferable[]) => void };

function parseLegacyPpt(u8: Uint8Array) {
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const len = u8.byteLength;
  let offset = 0;

  type PptSlide = { title: string; texts: string[] };
  const slides: PptSlide[] = [];
  let currentSlide: PptSlide | null = null;

  while (offset + 8 <= len) {
    const recType = view.getUint16(offset + 2, true);
    const recLen = view.getUint32(offset + 4, true);

    if (recType === 1006) {
      currentSlide = { title: `Slide ${slides.length + 1}`, texts: [] };
      slides.push(currentSlide);
      offset += 8;
      continue;
    }

    if (recLen > 0 && recLen < 5_000_000 && offset + 8 + recLen <= len) {
      if (recType === 4000) {
        try {
          const raw = new TextDecoder('utf-16le').decode(u8.subarray(offset + 8, offset + 8 + recLen));
          const cleaned = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim();
          if (cleaned && cleaned.length > 1) {
            if (!currentSlide) {
              currentSlide = { title: `Slide ${slides.length + 1}`, texts: [] };
              slides.push(currentSlide);
            }
            currentSlide.texts.push(cleaned);
          }
        } catch {}
        offset += 8 + recLen;
        continue;
      } else if (recType === 4008) {
        try {
          const raw = new TextDecoder('iso-8859-1').decode(u8.subarray(offset + 8, offset + 8 + recLen));
          const cleaned = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim();
          if (cleaned && cleaned.length > 1) {
            if (!currentSlide) {
              currentSlide = { title: `Slide ${slides.length + 1}`, texts: [] };
              slides.push(currentSlide);
            }
            currentSlide.texts.push(cleaned);
          }
        } catch {}
        offset += 8 + recLen;
        continue;
      }
    }

    offset += 2;
  }
  return slides;
}

self.onmessage = event => {
  try {
    const data = new Uint8Array(event.data);

    // Support legacy binary PowerPoint (.ppt 97-2003 OLE)
    if (data[0] === 0xD0 && data[1] === 0xCF && data[2] === 0x11 && data[3] === 0xE0) {
      const slides = parseLegacyPpt(data);
      if (slides.length > 0) {
        const pptPages = slides.map(s => ({
          title: s.title,
          blocks: s.texts.map(text => ({
            kind: 'paragraph' as const,
            runs: [{ text }]
          }))
        }));
        worker.postMessage({ pptPages });
        return;
      }
    }

    const xml: Record<string, string> = {};
    const images: Record<string, Uint8Array> = {};
    let totalImageBytes = 0;
    const MAX_TOTAL_IMAGE_BYTES = 70_000_000;
    const MAX_SINGLE_IMAGE_BYTES = 15_000_000;

    const entries = unzipSync(data, { filter(entry) {
      if (!/^(word|ppt)\//i.test(entry.name)) return false;
      if (!/\.(xml|rels|png|jpe?g|gif|webp)$/i.test(entry.name)) return false;
      return true;
    } });

    for (const [name, entryData] of Object.entries(entries)) {
      if (/\.(xml|rels)$/i.test(name)) {
        xml[name] = strFromU8(entryData);
      } else if (/\.(png|jpe?g|gif|webp)$/i.test(name)) {
        if (entryData.byteLength <= MAX_SINGLE_IMAGE_BYTES && (totalImageBytes + entryData.byteLength) <= MAX_TOTAL_IMAGE_BYTES) {
          images[name] = entryData;
          totalImageBytes += entryData.byteLength;
        }
      }
    }

    worker.postMessage({ xml, images }, Object.values(images).map(d => d.buffer as ArrayBuffer));
  } catch (error) {
    worker.postMessage({ error: error instanceof Error ? error.message : 'Dokumen tidak dapat dibaca langsung. Gunakan tata letak lengkap.' });
  }
};
