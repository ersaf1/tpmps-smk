import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const configured = !!supabaseUrl && !!publicKey;
export const db = createClient(
  supabaseUrl || "https://unconfigured.supabase.co",
  publicKey || "unconfigured",
  {db:{schema:'tpmps'}},
);
export async function api(path: string, body: unknown, method = "POST") {
  const { data } = await db.auth.getSession();
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}/api/${path}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.session?.access_token || ""}`,
      },
      body: JSON.stringify(body),
    },
  );
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Permintaan gagal");
  return result;
}
export async function allRows<T>(table: string): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from(table)
      .select("*")
      .order("id")
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...(data as T[]));
    if (data.length < 1000) return rows;
  }
}
