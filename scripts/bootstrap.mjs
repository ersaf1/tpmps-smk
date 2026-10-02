import { createClient } from "@supabase/supabase-js";
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.BOOTSTRAP_ADMIN_EMAIL,
  password = process.env.BOOTSTRAP_ADMIN_PASSWORD,
  name = process.env.BOOTSTRAP_ADMIN_NAME;
if (!url || !key || !email || !password || password.length < 12 || !name)
  throw new Error(
    "Isi SUPABASE_URL, secret server, BOOTSTRAP_ADMIN_EMAIL/PASSWORD (min 12)/NAME melalui environment lokal.",
  );
const db = createClient(url, key, { db:{schema:'tpmps'},auth: { persistSession: false } });
const { count, error } = await db
  .from("profiles")
  .select("id", { count: "exact", head: true })
  .eq("role", "superadmin")
  .eq("active", true);
if (error)
  throw new Error("Terapkan migrasi pada proyek baru terlebih dahulu.");
if (count)
  throw new Error(
    "Bootstrap ditolak: superadmin aktif sudah ada. Gunakan halaman Pengguna.",
  );
const { data, error: ae } = await db.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});
if (ae)
  throw new Error(
    "Pembuatan akun ditolak. Periksa konfigurasi Auth/email/password.",
  );
const { error: pe } = await db.from("profiles").insert({
  id: data.user.id,
  full_name: name,
  role: "superadmin",
  active: true,
});
if (pe) {
  await db.auth.admin.deleteUser(data.user.id);
  throw new Error("Profil gagal; akun bootstrap dibatalkan.");
}
console.log(
  "Superadmin berhasil dibuat. Hapus BOOTSTRAP_ADMIN_PASSWORD dari environment.",
);
