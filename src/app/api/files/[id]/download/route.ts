import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentProfile } from '@/lib/auth';
import { serverClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ message: 'Tidak terautentikasi.' }, { status: 401 });

  const { id } = await context.params;
  const supabase = await serverClient();
  const { data: file } = await supabase.from('file_entries').select('id, storage_path, original_name').eq('id', id).is('deleted_at', null).single();
  if (!file) return NextResponse.json({ message: 'File tidak ditemukan.' }, { status: 404 });

  const { data, error } = await supabase.storage.from('documents').createSignedUrl(file.storage_path, 60, { download: file.original_name });
  if (error || !data?.signedUrl) return NextResponse.json({ message: 'File tidak dapat diunduh.' }, { status: 403 });
  await supabase.from('audit_logs').insert({ actor_id: profile.id, action: 'DOWNLOAD_FILE', entity_type: 'file', entity_id: file.id });
  return NextResponse.redirect(data.signedUrl);
}
