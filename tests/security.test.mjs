import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
test("PostgreSQL migration, RLS, archive and Storage invariants", async (t) => {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create schema storage;
 create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint);
 create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text,metadata jsonb);
 alter table storage.objects enable row level security; grant usage on schema storage to authenticated; grant select,insert,update,delete on storage.objects to authenticated;`);
  const migration = readdirSync("supabase/migrations").find((n) =>
    n.endsWith("_archive_security.sql"),
  );
  await db.exec(readFileSync(`supabase/migrations/${migration}`, "utf8"));
  await db.exec('set search_path=tpmps,public');
  const ids = {
    admin: "00000000-0000-4000-8000-000000000001",
    school: "00000000-0000-4000-8000-000000000002",
    chair: "00000000-0000-4000-8000-000000000003",
    head: "00000000-0000-4000-8000-000000000004",
    head2: "00000000-0000-4000-8000-000000000005",
  };
  const unit = (
    await db.query(`insert into units(name) values('Unit tes A') returning id`)
  ).rows[0].id;
  const unit2 = (
    await db.query(`insert into units(name) values('Unit tes B') returning id`)
  ).rows[0].id;
  for (const [name, id] of Object.entries(ids)) {
    await db.query("insert into auth.users values($1)", [id]);
    await db.query(
      "insert into profiles(id,full_name,role,unit_id) values($1,$2,$3,$4)",
      [
        id,
        name,
        {
          admin: "superadmin",
          school: "kepala_sekolah",
          chair: "ketua_tpmps",
          head: "kepala_unit",
          head2: "kepala_unit",
        }[name],
        name === "head" ? unit : name === "head2" ? unit2 : null,
      ],
    );
  }
  const period = (
    await db.query(
      `insert into periods(name,starts_on,ends_on) values('Tes',(clock_timestamp() at time zone 'Asia/Jakarta')::date-1,(clock_timestamp() at time zone 'Asia/Jakarta')::date+1) returning id`,
    )
  ).rows[0].id;
  const spaces = (
    await db.query("select * from document_spaces where period_id=$1", [period])
  ).rows;
  const a = spaces.find((s) => s.unit_id === unit).id,
    b = spaces.find((s) => s.unit_id === unit2).id,
    chair = spaces.find((s) => !s.unit_id).id;
  const folder = (
    await db.query("select id from folders where space_id=$1 limit 1", [a])
  ).rows[0].id;
  async function as(name, sql, params = []) {
    await db.exec(
      `set role authenticated; set request.jwt.claim.sub='${ids[name]}'`,
    );
    try {
      return await db.query(sql, params);
    } finally {
      await db.exec("reset role");
    }
  }
  await t.test("defaults created for all spaces", async () => {
    assert.equal((await db.query("select * from folders")).rows.length, 6);
  });
  await t.test("unit head SELECT and UUID isolation", async () => {
    assert.equal(
      (await as("head", "select * from document_spaces")).rows.length,
      1,
    );
    assert.equal(
      (await as("head", "select * from folders where space_id=$1", [b])).rows
        .length,
      0,
    );
    await assert.rejects(
      as("head", `insert into folders(space_id,name) values($1,'Forbidden')`, [
        b,
      ]),
    );
    await assert.rejects(
      as("head", `insert into folders(space_id,name) values($1,'Forbidden')`, [
        chair,
      ]),
    );
  });
  await t.test("school is read-only, chair cannot write units", async () => {
    assert.equal(
      (await as("school", "select * from document_spaces")).rows.length,
      3,
    );
    await assert.rejects(
      as(
        "school",
        `insert into folders(space_id,name) values($1,'Forbidden')`,
        [a],
      ),
    );
    await assert.rejects(
      as("chair", `insert into folders(space_id,name) values($1,'Forbidden')`, [
        a,
      ]),
    );
    await as(
      "chair",
      `insert into folders(space_id,name) values($1,'Ketua tambahan')`,
      [chair],
    );
  });
  await t.test("self role/unit escalation denied", async () => {
    await assert.rejects(
      as(
        "head",
        `update profiles set role='superadmin',unit_id=null where id=$1`,
        [ids.head],
      ),
    );
  });
  let child;
  await t.test("folder cycle and cross-space moves denied", async () => {
    child = (
      await as(
        "head",
        `insert into folders(space_id,parent_id,name) values($1,$2,'Subfolder') returning id`,
        [a, folder],
      )
    ).rows[0].id;
    await assert.rejects(
      as("head", "update folders set parent_id=$1 where id=$2", [
        child,
        folder,
      ]),
    );
    await assert.rejects(
      as("admin", "update folders set space_id=$1 where id=$2", [b, child]),
    );
  });
  let file;
  await t.test("50 MB boundary and atomic object finalization", async () => {
    await assert.rejects(
      as(
        "head",
        `insert into files(space_id,folder_id,name,size) values($1,$2,'oversize',50000001)`,
        [a, folder],
      ),
    );
    file = (
      await as(
        "head",
        `insert into files(space_id,folder_id,name,size) values($1,$2,'boundary.pdf',50000000) returning *`,
        [a, folder],
      )
    ).rows[0];
    await assert.rejects(
      as(
        "head",
        `insert into storage.objects(bucket_id,name,metadata) values('tpmps-documents',$1,'{"size":1}')`,
        [file.object_key],
      ),
    );
    await as(
      "head",
      `insert into storage.objects(bucket_id,name,metadata) values('tpmps-documents',$1,'{"size":50000000}')`,
      [file.object_key],
    );
    assert.equal(
      (await as("head", "select status from files where id=$1", [file.id]))
        .rows[0].status,
      "ready",
    );
    assert.equal(
      (await as("head2", "select * from storage.objects")).rows.length,
      0,
    );
    await assert.rejects(
      as("head", "update files set object_key=$1 where id=$2", [
        "replacement",
        file.id,
      ]),
    );
  });
  await t.test("inactive stale session is rejected", async () => {
    await db.query("update profiles set active=false where id=$1", [ids.head]);
    assert.equal((await as("head", "select * from files")).rows.length, 0);
    await assert.rejects(
      as("head", `insert into folders(space_id,name) values($1,'Forbidden')`, [
        a,
      ]),
    );
    await db.query("update profiles set active=true where id=$1", [ids.head]);
  });
  await t.test("ownership follows unit assignment", async () => {
    await db.query("update profiles set unit_id=$1 where id=$2", [
      unit,
      ids.head2,
    ]);
    assert.equal((await as("head2", "select * from files")).rows.length, 1);
  });
  await t.test("Storage deletion synchronizes metadata", async () => {
    const temp = (
      await as(
        "head",
        `insert into files(space_id,folder_id,name,size) values($1,$2,'temp',1) returning *`,
        [a, folder],
      )
    ).rows[0];
    await as(
      "head",
      `insert into storage.objects(bucket_id,name,metadata) values('tpmps-documents',$1,'{"size":1}')`,
      [temp.object_key],
    );
    await as("head", "delete from storage.objects where name=$1", [
      temp.object_key,
    ]);
    assert.equal(
      (await db.query("select * from files where id=$1", [temp.id])).rows
        .length,
      0,
    );
  });
  await t.test(
    "ended period blocks every role and indirect removal",
    async () => {
      const pending = (
        await as(
          "head",
          `insert into files(space_id,folder_id,name,size) values($1,$2,'started-before-deadline',10) returning *`,
          [a, folder],
        )
      ).rows[0];
      await db.query(
        `update periods set ends_on=(clock_timestamp() at time zone 'Asia/Jakarta')::date-1 where id=$1`,
        [period],
      );
      await assert.rejects(
        as(
          "head",
          `insert into storage.objects(bucket_id,name,metadata) values('tpmps-documents',$1,'{"size":10}')`,
          [pending.object_key],
        ),
      );
      await assert.rejects(
        db.query("update files set name=$1 where id=$2", [
          "service-role-attempt",
          file.id,
        ]),
      );
      for (const name of Object.keys(ids)) {
        await assert.rejects(
          as(name, `insert into folders(space_id,name) values($1,'Locked')`, [
            a,
          ]),
        );
        assert.equal(
          (
            await as(
              name,
              "update files set name=$1 where id=$2 returning id",
              ["rename", file.id],
            )
          ).rows.length,
          0,
        );
        assert.equal(
          (
            await as(
              name,
              "delete from storage.objects where name=$1 returning id",
              [file.object_key],
            )
          ).rows.length,
          0,
        );
      }
      assert.equal(
        (await as("admin", "select * from storage.objects")).rows.length,
        1,
      );
      await assert.rejects(
        as("admin", `update periods set ends_on='2099-01-01' where id=$1`, [
          period,
        ]),
      );
      await assert.rejects(
        as("admin", "delete from periods where id=$1", [period]),
      );
      await assert.rejects(
        as("admin", "delete from units where id=$1", [unit]),
      );
      await assert.rejects(
        db.query("delete from auth.users where id=$1", [ids.head]),
      );
    },
  );
  await t.test("Jakarta inclusive day boundaries", async () => {
    const { rows } = await db.query(
      `select ('2026-10-02 16:59:59+00'::timestamptz at time zone 'Asia/Jakarta')::date::text as before,('2026-10-02 17:00:00+00'::timestamptz at time zone 'Asia/Jakarta')::date::text as after`,
    );
    assert.equal(rows[0].before, "2026-10-02");
    assert.equal(rows[0].after, "2026-10-03");
  });
  await db.close();
});
