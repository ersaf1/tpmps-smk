import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
});

async function run() {
  await client.connect();
  console.log("Connected to PostgreSQL.");

  // 1. Try to expose schema tpmps to PostgREST
  try {
    await client.query(`
      ALTER ROLE authenticator SET pgrst.db_schemas = 'public, storage, graphql_public, tpmps';
      NOTIFY pgrst, 'reload config';
      NOTIFY pgrst, 'reload schema';
    `);
    console.log("Successfully ran ALTER ROLE authenticator SET pgrst.db_schemas!");
  } catch (err) {
    console.warn("Could not alter authenticator role directly:", err.message);
  }

  // 2. Populate tpmps.units from public.document_units
  const unitsResult = await client.query(`
    INSERT INTO tpmps.units (id, name, active)
    SELECT id, name, is_active FROM public.document_units
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, active = EXCLUDED.active
    RETURNING id, name;
  `);
  console.log(`Inserted/Updated ${unitsResult.rowCount} units.`);

  // 3. Populate tpmps.periods from public.periods or default
  const periodResult = await client.query(`
    INSERT INTO tpmps.periods (id, name, starts_on, ends_on)
    SELECT id, name, starts_on::date, ends_on::date FROM public.periods
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, starts_on = EXCLUDED.starts_on, ends_on = EXCLUDED.ends_on
    RETURNING id, name;
  `);
  console.log(`Inserted/Updated ${periodResult.rowCount} periods.`);

  // If no periods, create default active period 2026/2027
  if (periodResult.rowCount === 0) {
    const defaultPeriod = await client.query(`
      INSERT INTO tpmps.periods (name, starts_on, ends_on)
      VALUES ('Tahun Ajaran 2026/2027', '2026-01-01', '2026-12-31')
      RETURNING id, name;
    `);
    console.log("Created default period:", defaultPeriod.rows[0]);
  }

  // 4. Populate tpmps.profiles from public.profiles and auth.users
  await client.query(`
    ALTER TABLE tpmps.profiles ADD COLUMN IF NOT EXISTS email text;
  `);

  const profilesResult = await client.query(`
    INSERT INTO tpmps.profiles (id, full_name, role, unit_id, active, email)
    SELECT
      p.id,
      p.full_name,
      CASE
        WHEN p.role::text = 'admin' THEN 'superadmin'
        WHEN p.role::text = 'ketua_unit' THEN 'kepala_unit'
        WHEN p.role::text = 'guru' THEN 'kepala_unit'
        WHEN p.role::text IN ('superadmin', 'kepala_sekolah', 'ketua_tpmps', 'kepala_unit') THEN p.role::text
        ELSE 'kepala_unit'
      END AS role,
      CASE
        WHEN p.role::text IN ('admin', 'superadmin', 'kepala_sekolah', 'ketua_tpmps') THEN NULL
        ELSE p.unit_id
      END AS unit_id,
      p.is_active AS active,
      u.email
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.id
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      unit_id = EXCLUDED.unit_id,
      active = EXCLUDED.active,
      email = COALESCE(EXCLUDED.email, tpmps.profiles.email)
    RETURNING id, full_name, role;
  `);
  console.log(`Inserted/Updated ${profilesResult.rowCount} profiles.`);

  await client.end();
}

run().catch((err) => {
  console.error("Setup error:", err);
  process.exit(1);
});
