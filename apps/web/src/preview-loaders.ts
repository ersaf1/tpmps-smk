import { previewKind } from '../../shared/preview.mjs';
export const loadViewer = () => import('./FileViewer').then(module => ({ default: module.FileViewer }));
export const loadPdf = () => import('./PdfReader');
export const loadOffice = () => import('./OfficeReader');
export const loadSpreadsheet = () => import('./SpreadsheetReader');
/** Load renderer code on interaction intent, without requesting private documents. */
export function warmPreview(name: string, mime: string) {
  void loadViewer().catch(() => {});
  const kind = previewKind(name, mime);
  const load = kind === 'pdf' ? loadPdf : kind === 'office' ? loadOffice : kind === 'spreadsheet' ? loadSpreadsheet : null;
  if (load) void load().catch(() => {});
}
