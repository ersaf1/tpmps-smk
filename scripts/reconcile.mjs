// Operator logs in as an existing superadmin; never bypasses RLS/period locking.
import { createClient } from "@supabase/supabase-js";
const db = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { db:{schema:'tpmps'},auth: { persistSession: false } },
);
const { error } = await db.auth.signInWithPassword({
  email: process.env.OPERATOR_EMAIL,
  password: process.env.OPERATOR_PASSWORD,
});
if (error) throw new Error("Login operator gagal");
const { data: user } = await db.auth.getUser();
const { data: profile } = await db
  .from("profiles")
  .select("role,active")
  .eq("id", user.user.id)
  .single();
if (!profile?.active || profile.role !== "superadmin")
  throw new Error("Hanya superadmin");
const { data: pending, error: pe } = await db
  .from("files")
  .select("id,created_at,space_id")
  .eq("status", "pending")
  .lt("created_at", new Date(Date.now() - 86400000).toISOString());
if (pe) throw pe;
const apply = process.argv.includes("--apply");
let removed = 0;
for (const file of pending) {
  const { data: spaces } = await db
    .from("document_spaces")
    .select("period_id")
    .eq("id", file.space_id)
    .single();
  const { data: period } = await db
    .from("periods")
    .select("starts_on,ends_on")
    .eq("id", spaces.period_id)
    .single();
  const { data: now } = await db.rpc("server_clock");
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(new Date(now));
  if (today < period.starts_on || today > period.ends_on) continue;
  if (apply) {
    const { error } = await db
      .from("files")
      .delete()
      .eq("id", file.id)
      .eq("status", "pending");
    if (error) throw error;
    removed++;
  } else console.log(`Pending aktif >24 jam: ${file.id}`);
}
console.log(
  apply
    ? `${removed} metadata pending direkonsiliasi.`
    : "Dry run. Gunakan --apply untuk menghapus hanya metadata pending dalam periode aktif.",
);
await db.auth.signOut();
