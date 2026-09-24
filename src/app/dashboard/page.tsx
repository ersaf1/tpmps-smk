import { redirect } from 'next/navigation';
import DocumentExplorer from '@/components/documents/DocumentExplorer';
import { requireProfile } from '@/lib/auth';
import { serverClient } from '@/lib/supabase/server';
import type { FileItem, FolderItem, PeriodItem } from '@/types/documents';

interface DashboardProps {
  searchParams: Promise<{ period?: string; folder?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const profile = await requireProfile();
  if (profile.mustChangePassword) redirect('/account/password');
  const supabase = await serverClient();
  const params = await searchParams;

  const [{ data: periodRows }, { data: unitRows }] = await Promise.all([
    supabase.from('periods').select('id, name, starts_on, ends_on, is_active').order('starts_on', { ascending: false }),
    supabase.from('document_units').select('id, name').eq('is_active', true).order('sort_order')
  ]);

  const periods: PeriodItem[] = (periodRows ?? []).map((row) => ({
    id: row.id, name: row.name, startsOn: row.starts_on, endsOn: row.ends_on, isActive: row.is_active
  }));
  const selectedPeriod = periods.find((item) => item.id === params.period)
    ?? periods.find((item) => item.isActive)
    ?? periods[0]
    ?? null;

  if (selectedPeriod && !params.period) redirect(`/dashboard?period=${selectedPeriod.id}`);

  let currentFolder: FolderItem | null = null;
  if (selectedPeriod && params.folder) {
    const { data } = await supabase.from('folders').select('id, name, parent_id, period_id, scope, document_kind, unit_id, created_at, unit:document_units!unit_id(name)').eq('id', params.folder).eq('period_id', selectedPeriod.id).is('deleted_at', null).single();
    if (data) {
      const unit = Array.isArray(data.unit) ? data.unit[0] : data.unit;
      currentFolder = { id: data.id, name: data.name, parentId: data.parent_id, periodId: data.period_id, scope: data.scope, documentKind: data.document_kind, unitId: data.unit_id, unitName: unit?.name ?? null, createdAt: data.created_at } as FolderItem;
    }
  }

  let folders: FolderItem[] = [];
  let files: FileItem[] = [];
  if (selectedPeriod) {
    let folderQuery = supabase.from('folders').select('id, name, parent_id, period_id, scope, document_kind, unit_id, created_at, unit:document_units!unit_id(name)').eq('period_id', selectedPeriod.id).is('deleted_at', null).order('name');
    folderQuery = currentFolder ? folderQuery.eq('parent_id', currentFolder.id) : folderQuery.is('parent_id', null);
    const { data: folderRows } = await folderQuery;
    folders = (folderRows ?? []).map((row) => {
      const unit = Array.isArray(row.unit) ? row.unit[0] : row.unit;
      return { id: row.id, name: row.name, parentId: row.parent_id, periodId: row.period_id, scope: row.scope, documentKind: row.document_kind, unitId: row.unit_id, unitName: unit?.name ?? null, createdAt: row.created_at } as FolderItem;
    });

    if (currentFolder) {
      const { data: fileRows } = await supabase.from('file_entries').select('id, folder_id, original_name, mime_type, size_bytes, created_at').eq('folder_id', currentFolder.id).is('deleted_at', null).order('original_name');
      files = (fileRows ?? []).map((row) => ({ id: row.id, folderId: row.folder_id, originalName: row.original_name, mimeType: row.mime_type, sizeBytes: row.size_bytes, createdAt: row.created_at }));
    }
  }

  return <DocumentExplorer profile={profile} periods={periods} selectedPeriod={selectedPeriod} currentFolder={currentFolder} folders={folders} files={files} units={unitRows ?? []} />;
}
