import {
  adminClient,
  authorize,
  failure,
  HttpError,
  text,
} from "../../../lib/auth";
export const runtime = "nodejs";
async function validate(
  body: Record<string, unknown>,
  client: Awaited<ReturnType<typeof authorize>>["client"],
) {
  const full_name = text(body.full_name, "Nama");
  const role = text(body.role, "Peran");
  if (
    !["superadmin", "kepala_sekolah", "ketua_tpmps", "kepala_unit"].includes(
      role,
    )
  )
    throw new HttpError(400, "Peran tidak valid");
  const unit_id = role === "kepala_unit" ? text(body.unit_id, "Unit") : null;
  if (unit_id) {
    const { data } = await client
      .from("units")
      .select("id")
      .eq("id", unit_id)
      .eq("active", true)
      .maybeSingle();
    if (!data) throw new HttpError(400, "Pilih unit aktif");
  }
  return { full_name, role, unit_id, active: body.active !== false };
}
export async function POST(request: Request) {
  try {
    const { client } = await authorize(request);
    const body = await request.json();
    const profile = await validate(body, client);
    const email = text(body.email, "Email", 254);
    const password = text(body.password, "Kata sandi", 128);
    if (password.length < 12)
      throw new HttpError(400, "Kata sandi minimal 12 karakter");
    const admin = adminClient();
    await authorize(request);
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error || !data.user)
      throw new HttpError(
        400,
        "Akun gagal dibuat. Periksa email dan kebijakan kata sandi.",
      );
    const { error: pe } = await admin
      .from("profiles")
      .insert({ id: data.user.id, ...profile });
    if (pe) {
      await admin.auth.admin.deleteUser(data.user.id);
      throw new HttpError(409, "Profil gagal dibuat; akun baru dibatalkan.");
    }
    return Response.json({ id: data.user.id }, { status: 201 });
  } catch (error) {
    return failure(error);
  }
}
export async function PATCH(request: Request) {
  try {
    const { client, profile: caller } = await authorize(request);
    const body = await request.json();
    const id = text(body.id, "ID");
    const profile = await validate(body, client);
    if (id === caller.id && (profile.role !== "superadmin" || !profile.active))
      throw new HttpError(409, "Tidak dapat mencabut akses admin sendiri");
    const admin = adminClient();
    await authorize(request);
    const { data, error } = await admin
      .from("profiles")
      .update(profile)
      .eq("id", id)
      .select("id")
      .single();
    if (error || !data) throw new HttpError(400, "Profil gagal diperbarui");
    return Response.json({ id: data.id });
  } catch (error) {
    return failure(error);
  }
}
