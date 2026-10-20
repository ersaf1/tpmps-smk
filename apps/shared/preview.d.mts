export const OFFICE_MIMES: Record<string, string>;
export const OFFICE_EXTENSIONS: Set<string>;
export function officeExtension(name: string, mime?: string): string | null;
export function previewKind(name: string, mime?: string): 'office' | 'spreadsheet' | 'pdf' | 'image' | 'audio' | 'video' | 'text' | 'binary';
