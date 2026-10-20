// Preview classification is shared by the UI and authenticated conversion route.
export const OFFICE_MIMES = {
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-word.document.macroenabled.12': 'docm',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.ms-powerpoint.presentation.macroenabled.12': 'pptm',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ppsx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-excel.sheet.macroenabled.12': 'xlsm',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/vnd.oasis.opendocument.presentation': 'odp',
  'application/vnd.oasis.opendocument.spreadsheet': 'ods',
  'application/rtf': 'rtf',
};
export const OFFICE_EXTENSIONS = new Set([
  ...Object.values(OFFICE_MIMES), 'dot', 'dotx', 'dotm', 'pps', 'pot', 'potx',
  'ppsm', 'potm', 'xlt', 'xltx', 'xltm', 'xlsb', 'ott', 'otp', 'ots', 'odg',
]);
export function officeExtension(name, mime = '') {
  const known = OFFICE_MIMES[mime.toLowerCase()];
  if (known) return known;
  const ext = name.split('.').pop()?.toLowerCase() || '';
  return OFFICE_EXTENSIONS.has(ext) ? ext : null;
}
export function previewKind(name, mime = '') {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const office = officeExtension(name, mime);
  if (/^(xlsx?|xlsm|xlsb|xltx?|xltm|ods|ots|fods|csv|tsv|numbers)$/.test(office || ext) || mime === 'text/csv') return 'spreadsheet';
  if (office) return 'office';
  if (mime === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (mime.startsWith('image/') || /^(png|jpe?g|webp|gif|bmp|avif|ico|svg)$/.test(ext)) return 'image';
  if (mime.startsWith('audio/') || /^(mp3|wav|ogg|m4a|flac|aac)$/.test(ext)) return 'audio';
  if (mime.startsWith('video/') || /^(mp4|webm|mov|m4v|ogv)$/.test(ext)) return 'video';
  if (mime.startsWith('text/') || /^(txt|csv|tsv|json|md|log|xml|yaml|yml|html|css|js|ts|py|sql)$/.test(ext)) return 'text';
  return 'binary';
}
