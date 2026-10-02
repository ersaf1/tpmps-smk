export type DocumentRole = 'superadmin' | 'ketua_tpmps' | 'kepala_sekolah' | 'ketua_unit';
export type FolderScope = 'tpmps' | 'unit';
export type DocumentKind =
  | 'manual_mutu'
  | 'prosedur_mutu'
  | 'dokumen_lainnya'
  | 'petunjuk_kerja'
  | 'catatan_mutu';

export interface AuthProfile {
  id: string;
  email: string;
  fullName: string;
  positionName: string;
  role: DocumentRole;
  unitId: string | null;
  unitName: string | null;
  mustChangePassword: boolean;
}

export interface PeriodItem {
  id: string;
  name: string;
  startsOn: string;
  endsOn: string;
  isActive: boolean;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  periodId: string;
  scope: FolderScope;
  documentKind: DocumentKind | null;
  unitId: string | null;
  unitName: string | null;
  createdAt: string;
}

export interface FileItem {
  id: string;
  folderId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export const ROLE_LABELS: Record<DocumentRole, string> = {
  superadmin: 'Superadmin',
  ketua_tpmps: 'Ketua TPMPS',
  kepala_sekolah: 'Kepala Sekolah',
  ketua_unit: 'Ketua Unit'
};

export const KIND_LABELS: Record<DocumentKind, string> = {
  manual_mutu: 'Manual Mutu',
  prosedur_mutu: 'Prosedur Mutu',
  dokumen_lainnya: 'Dokumen Lainnya',
  petunjuk_kerja: 'Petunjuk Kerja',
  catatan_mutu: 'Catatan Mutu'
};
