import { db, publicKey, supabaseUrl } from './client';
export { readFileSlice } from '../../shared/read-range.mjs';
export type RemoteFile = { url: string; headers: Record<string, string>; size: number };
export async function remoteFile(key: string, size: number): Promise<RemoteFile> {
  const { data } = await db.auth.getSession();
  if (!data.session?.access_token) throw new Error('Sesi berakhir. Silakan masuk kembali.');
  return { url: `${supabaseUrl}/storage/v1/object/tpmps-documents/${key.split('/').map(encodeURIComponent).join('/')}`,
    headers: { apikey: publicKey, Authorization: `Bearer ${data.session.access_token}` }, size };
}
