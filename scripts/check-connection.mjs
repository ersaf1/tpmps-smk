import pg from "pg";
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (url && key) {
  try {
    const r = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(15000),
    });
    const d = await r.json();
    console.log(
      JSON.stringify({
        authStatus: r.status,
        signupDisabled: d.disable_signup,
      }),
    );
  } catch {
    console.log("Auth unreachable");
  }
}
if (process.env.DATABASE_URL) {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 15000,
  });
  try {
    await client.connect();
    console.log(
      JSON.stringify({
        databaseConnected: true,
        tables: (
          await client.query(
            "select tablename from pg_tables where schemaname='tpmps'",
          )
        ).rows.map((r) => r.tablename),
      }),
    );
  } catch {
    console.log(
      "Database connection unavailable (credentials/network/TLS). No schema was changed.",
    );
  } finally {
    await client.end();
  }
}
console.log(
  JSON.stringify({
    adminSecretConfigured: !!(
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
  }),
);
