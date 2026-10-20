import { File, FileText, FileSpreadsheet, Presentation, Image, Film, Music, FileArchive, FileCode } from 'lucide-react';
import { previewKind } from '../../shared/preview.mjs';

export function FileIcon({ name, mime = '', size = 20 }: { name: string; mime?: string; size?: number }) {
  const kind = previewKind(name, mime);
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const [Icon, tone, label] = kind === 'pdf' ? [FileText, 'pdf', 'PDF'] as const
    : kind === 'spreadsheet' ? [FileSpreadsheet, 'sheet', 'Spreadsheet'] as const
    : /^(pptx?|pptm|ppsx?|odp|potx?)$/.test(ext) ? [Presentation, 'slides', 'Presentasi'] as const
    : kind === 'office' ? [FileText, 'word', 'Dokumen'] as const
    : kind === 'image' ? [Image, 'image', 'Gambar'] as const
    : kind === 'video' ? [Film, 'video', 'Video'] as const
    : kind === 'audio' ? [Music, 'audio', 'Audio'] as const
    : /^(zip|rar|7z|gz|tar)$/.test(ext) ? [FileArchive, 'archive', 'Arsip'] as const
    : kind === 'text' ? [FileCode, 'text', 'Teks'] as const
    : [File, 'other', 'File'] as const;
  return <span className={`file-type-icon file-type-${tone}`} title={label}><Icon size={size} strokeWidth={1.7} aria-hidden="true" /></span>;
}
