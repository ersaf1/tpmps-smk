import "server-only";
import { createClient } from "@supabase/supabase-js";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function configuration() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new HttpError(503, "Konfigurasi Supabase belum tersedia");
  return { url, key };
}
export async function authorize(request: Request) {
  const { url, key } = configuration();
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer "))
    throw new HttpError(401, "Silakan login");
  const client = createClient(url, key, {
    db:{schema:'tpmps'},
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser(authorization.slice(7));
  if (error || !data.user) throw new HttpError(401, "Sesi tidak valid");
  const { data: profile, error: pe } = await client
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();
  if (pe || !profile?.active || profile.role !== "superadmin")
    throw new HttpError(403, "Hanya superadmin aktif");
  return { client, profile };
}
export function adminClient() {
  const { url } = configuration();
  const secret =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret)
    throw new HttpError(503, "Secret Supabase server belum dikonfigurasi");
  return createClient(url, secret, {
    db:{schema:'tpmps'},
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export function failure(error: unknown) {
  return Response.json(
    {
      error:
        error instanceof HttpError
          ? error.message
          : "Operasi gagal. Periksa konfigurasi atau coba kembali.",
    },
    { status: error instanceof HttpError ? error.status : 500 },
  );
}
export function text(value: unknown, label: string, max = 160) {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new HttpError(400, `${label} tidak valid`);
  return value.trim();
}
