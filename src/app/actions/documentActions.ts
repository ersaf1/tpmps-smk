'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireProfile } from '@/lib/auth';
import { serverClient } from '@/lib/supabase/server';
import type { DocumentKind, FolderScope } from '@/types/documents';

export interface DocumentActionState {
  success?: string;
  error?: string;
}

const allowedKinds: DocumentKind[] = ['manual_mutu', 'prosedur_mutu', 'dokumen_lainnya', 'petunjuk_kerja', 'catatan_mutu'];

export async function createPeriodAction(_state: DocumentActionState, formData: FormData): Promise<DocumentActionState> {
  const profile = await requireProfile();
  if (!['superadmin', 'kepala_sekolah'].includes(profile.role)) return { error: 'Anda tidak memiliki izin membuat periode.' };

  const name = String(formData.get('name') ?? '').trim();
  const startsOn = String(formData.get('startsOn') ?? '');
  const endsOn = String(formData.get('endsOn') ?? '');
  if (!/^\d{4}\/\d{4}$/.test(name) || !startsOn || !endsOn || endsOn <= startsOn) {
    return { error: 'Nama dan rentang tanggal periode tidak valid.' };
  }

  const supabase = await serverClient();
  const { data, error } = await supabase.from('periods').insert({ name, starts_on: startsOn, ends_on: endsOn, created_by: profile.id }).select('id').single();
  if (error) return { error: error.code === '23505' ? 'Periode tersebut sudah tersedia.' : 'Periode gagal dibuat.' };
  await supabase.from('audit_logs').insert({ actor_id: profile.id, action: 'CREATE_PERIOD', entity_type: 'period', entity_id: data.id, details: { name } });
  revalidatePath('/dashboard');
  return { success: `Periode ${name} berhasil dibuat.` };
}

export async function createFolderAction(_state: DocumentActionState, formData: FormData): Promise<DocumentActionState> {
  const profile = await requireProfile();
  if (profile.role === 'kepala_sekolah') return { error: 'Kepala Sekolah memiliki akses baca saja untuk dokumen.' };

  const name = String(formData.get('name') ?? '').trim();
  const periodId = String(formData.get('periodId') ?? '');
  const parentId = String(formData.get('parentId') ?? '') || null;
  const requestedKind = String(formData.get('documentKind') ?? '') as DocumentKind;
  if (name.length < 1 || name.length > 120 || !periodId) return { error: 'Nama folder tidak valid.' };

  const supabase = await serverClient();
  let scope: FolderScope;
  let unitId: string | null;
  let documentKind: DocumentKind | null = allowedKinds.includes(requestedKind) ? requestedKind : null;

  if (parentId) {
    const { data: parent } = await supabase.from('folders').select('scope, unit_id, document_kind').eq('id', parentId).is('deleted_at', null).single();
    if (!parent) return { error: 'Folder induk tidak ditemukan.' };
    scope = parent.scope as FolderScope;
    unitId = parent.unit_id;
    documentKind = parent.document_kind as DocumentKind | null;
  } else if (profile.role === 'ketua_tpmps') {
    scope = 'tpmps'; unitId = null;
  } else if (profile.role === 'ketua_unit') {
    scope = 'unit'; unitId = profile.unitId;
  } else {
    scope = formData.get('scope') === 'unit' ? 'unit' : 'tpmps';
    unitId = scope === 'unit' ? String(formData.get('unitId') ?? '') || null : null;
  }

  if (scope === 'unit' && !unitId) return { error: 'Unit kerja wajib dipilih.' };
  const { data, error } = await supabase.from('folders').insert({ period_id: periodId, parent_id: parentId, unit_id: unitId, scope, document_kind: documentKind, name, created_by: profile.id }).select('id').single();
  if (error) return { error: error.code === '23505' ? 'Nama folder sudah digunakan pada lokasi ini.' : 'Folder gagal dibuat.' };
  await supabase.from('audit_logs').insert({ actor_id: profile.id, action: 'CREATE_FOLDER', entity_type: 'folder', entity_id: data.id, details: { name } });
  revalidatePath('/dashboard');
  return { success: `Folder “${name}” berhasil dibuat.` };
}

export async function deleteFolderAction(formData: FormData) {
  const profile = await requireProfile();
  const id = String(formData.get('id') ?? '');
  const supabase = await serverClient();
  const { data: accessibleFolders } = await supabase.from('folders').select('id, parent_id').is('deleted_at', null);
  const ids = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const folder of accessibleFolders ?? []) {
      if (folder.parent_id && ids.has(folder.parent_id) && !ids.has(folder.id)) {
        ids.add(folder.id); changed = true;
      }
    }
  }
  const deletedAt = new Date().toISOString();
  const folderIds = Array.from(ids);
  const { error } = await supabase.from('folders').update({ deleted_at: deletedAt }).in('id', folderIds);
  if (!error) await supabase.from('file_entries').update({ deleted_at: deletedAt }).in('folder_id', folderIds);
  if (!error) await supabase.from('audit_logs').insert({ actor_id: profile.id, action: 'DELETE_FOLDER', entity_type: 'folder', entity_id: id });
  revalidatePath('/dashboard');
}

export async function deleteFileAction(formData: FormData) {
  const profile = await requireProfile();
  const id = String(formData.get('id') ?? '');
  const supabase = await serverClient();
  const { error } = await supabase.from('file_entries').update({ deleted_at: new Date().toISOString() }).eq('id', id);
  if (!error) await supabase.from('audit_logs').insert({ actor_id: profile.id, action: 'DELETE_FILE', entity_type: 'file', entity_id: id });
  revalidatePath('/dashboard');
}

export async function openFolderAction(formData: FormData) {
  const period = String(formData.get('period') ?? '');
  const folder = String(formData.get('folder') ?? '');
  redirect(`/dashboard?period=${encodeURIComponent(period)}&folder=${encodeURIComponent(folder)}`);
}
