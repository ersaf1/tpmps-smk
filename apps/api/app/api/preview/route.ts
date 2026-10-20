import { authorizeReader, failure, HttpError } from '../../../lib/auth';
import { convertOffice, PreviewError } from '../../../lib/convert-preview.mjs';
import { officeExtension } from '../../../../shared/preview.mjs';

export const runtime = 'nodejs';
export const maxDuration = 240;
export async function GET(request: Request) {
  try {
    const { client } = await authorizeReader(request);
    const id = new URL(request.url).searchParams.get('id');
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      throw new HttpError(400, 'ID dokumen tidak valid.');
    }
    const { data: file, error } = await client.from('files')
      .select('id, name, mime_type, object_key, size, status').eq('id', id).eq('status', 'ready').single();
    if (error || !file) throw new HttpError(404, 'Dokumen tidak ditemukan atau tidak dapat diakses.');
    const extension = officeExtension(file.name, file.mime_type);
    if (!extension) throw new HttpError(415, 'Dokumen ini tidak memerlukan konversi Office.');
    if (file.size > 50_000_000) throw new HttpError(413, 'Ukuran dokumen melebihi 50 MB.');
    const { data: blob, error: storageError } = await client.storage.from('tpmps-documents').download(file.object_key);
    if (storageError || !blob) throw new HttpError(403, 'Dokumen tidak dapat dibaca dengan akses akun ini.');
    const pdf = await convertOffice(Buffer.from(await blob.arrayBuffer()), extension, request.signal);
    // Recheck the current reader before returning a potentially long-running conversion.
    await authorizeReader(request);
    const { data: stillVisible } = await client.from('files').select('id').eq('id', id).eq('status', 'ready').maybeSingle();
    if (!stillVisible) throw new HttpError(403, 'Akses dokumen sudah berubah.');
    return new Response(new Uint8Array(pdf), { headers: {
      'Content-Type': 'application/pdf', 'Cache-Control': 'private, no-store',
      'Content-Disposition': 'inline; filename="preview.pdf"', 'X-Content-Type-Options': 'nosniff',
    } });
  } catch (error) {
    const response = failure(error instanceof PreviewError ? new HttpError(error.status, error.message) : error);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }
}
