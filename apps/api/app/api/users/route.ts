import {
  adminClient,
  authorize,
  failure,
  HttpError,
  text,
} from "../../../lib/auth";
import { dbQuery, withTransaction } from "../../../lib/db";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  ) {
    throw new HttpError(400, "Peran tidak valid");
  }
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

export async function GET(request: Request) {
  try {
    await authorize(request);
    const result = await dbQuery(`
      SELECT 
        p.id,
        p.full_name,
        p.role,
        p.unit_id,
        p.active,
        p.created_at,
        COALESCE(p.email, u.email) as email
      FROM tpmps.profiles p
      LEFT JOIN auth.users u ON u.id = p.id
      ORDER BY p.full_name ASC
    `);
    return Response.json(result.rows);
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  try {
    const { client } = await authorize(request);
    const body = await request.json();
    const profile = await validate(body, client);
    const email = text(body.email, "Email", 254).toLowerCase();
    if (!EMAIL_REGEX.test(email)) {
      throw new HttpError(400, "Format email tidak valid");
    }
    const password = text(body.password, "Kata sandi", 128);
    if (password.length < 12) {
      throw new HttpError(400, "Kata sandi minimal 12 karakter");
    }

    const admin = adminClient();
    if (admin) {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error || !data.user) {
        throw new HttpError(
          400,
          error?.message || "Akun gagal dibuat. Periksa email dan kata sandi.",
        );
      }
      const { error: pe } = await admin
        .from("profiles")
        .insert({ id: data.user.id, ...profile, email });
      if (pe) {
        await admin.auth.admin.deleteUser(data.user.id);
        throw new HttpError(409, "Profil gagal dibuat; akun baru dibatalkan.");
      }
      return Response.json(
        { id: data.user.id, message: "Pengguna berhasil dibuat" },
        { status: 201 },
      );
    }

    // Direct Database Execution via Transaction
    const newUserId = await withTransaction(async (pgClient) => {
      // Check existing email
      const existing = await pgClient.query(
        "SELECT id FROM auth.users WHERE lower(email) = lower($1) LIMIT 1",
        [email],
      );
      if (existing.rowCount && existing.rowCount > 0) {
        throw new HttpError(409, "Email tersebut sudah terdaftar pada sistem.");
      }

      // Insert user, identity, and profile atomically
      const userRes = await pgClient.query(
        `WITH new_user AS (
          INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            confirmation_token,
            recovery_token,
            email_change_token_new,
            email_change,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            created_at,
            updated_at,
            phone_change,
            phone_change_token,
            email_change_token_current,
            email_change_confirm_status,
            reauthentication_token,
            is_sso_user,
            is_anonymous
          ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            $1,
            crypt($2, gen_salt('bf', 10)),
            now(),
            '',
            '',
            '',
            '',
            '{"provider":"email","providers":["email"]}'::jsonb,
            json_build_object('full_name', $3::text)::jsonb,
            false,
            now(),
            now(),
            '',
            '',
            '',
            0,
            '',
            false,
            false
          )
          RETURNING id, email
        ),
        new_identity AS (
          INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            provider_id,
            last_sign_in_at,
            created_at,
            updated_at
          )
          SELECT
            gen_random_uuid(),
            new_user.id,
            json_build_object('sub', new_user.id::text, 'email', new_user.email)::jsonb,
            'email',
            new_user.id::text,
            now(),
            now(),
            now()
          FROM new_user
          RETURNING id
        ),
        new_profile AS (
          INSERT INTO tpmps.profiles (
            id,
            full_name,
            role,
            unit_id,
            active,
            email
          )
          SELECT
            new_user.id,
            $3::text,
            $4::text,
            $5::uuid,
            $6::boolean,
            new_user.email
          FROM new_user
          RETURNING id
        )
        SELECT id FROM new_user;`,
        [email, password, profile.full_name, profile.role, profile.unit_id, profile.active],
      );
      const uid = userRes.rows[0].id;

      // Optional legacy sync to public.profiles
      try {
        await pgClient.query(
          `INSERT INTO public.profiles (
            id,
            email,
            full_name,
            position_name,
            role,
            unit_id,
            is_active,
            must_change_password
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, false)
          ON CONFLICT (id) DO NOTHING`,
          [
            uid,
            email,
            profile.full_name,
            profile.role === "superadmin"
              ? "Administrator"
              : profile.role === "kepala_sekolah"
                ? "Kepala Sekolah"
                : profile.role === "ketua_tpmps"
                  ? "Ketua TPMPS"
                  : "Kepala Unit",
            profile.role === "superadmin"
              ? "admin"
              : profile.role === "kepala_unit"
                ? "ketua_unit"
                : profile.role,
            profile.unit_id,
            profile.active,
          ],
        );
      } catch {
        // Safe to ignore if public table constraints differ
      }

      return uid;
    });

    return Response.json(
      { id: newUserId, message: "Pengguna berhasil dibuat" },
      { status: 201 },
    );
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
    if (id === caller.id && (profile.role !== "superadmin" || !profile.active)) {
      throw new HttpError(409, "Tidak dapat mencabut akses admin sendiri");
    }

    const email = typeof body.email === "string" && body.email.trim()
      ? text(body.email, "Email", 254).toLowerCase()
      : null;
    if (email && !EMAIL_REGEX.test(email)) {
      throw new HttpError(400, "Format email tidak valid");
    }

    const password = typeof body.password === "string" && body.password.trim()
      ? text(body.password, "Kata sandi", 128)
      : null;
    if (password && password.length < 12) {
      throw new HttpError(400, "Kata sandi baru minimal 12 karakter");
    }

    const admin = adminClient();
    if (admin) {
      if (email) {
        await admin.auth.admin.updateUserById(id, { email, email_confirm: true });
      }
      if (password) {
        await admin.auth.admin.updateUserById(id, { password });
      }
      const { data, error } = await admin
        .from("profiles")
        .update({
          full_name: profile.full_name,
          role: profile.role,
          unit_id: profile.unit_id,
          active: profile.active,
          ...(email ? { email } : {}),
        })
        .eq("id", id)
        .select("id")
        .single();
      if (error || !data) throw new HttpError(400, "Profil gagal diperbarui");
      return Response.json({ id: data.id, message: "Pengguna berhasil diperbarui" });
    }

    // Direct Database Execution via Transaction
    await withTransaction(async (pgClient) => {
      // 1. Update tpmps.profiles
      if (email) {
        await pgClient.query(
          `UPDATE tpmps.profiles 
           SET full_name = $1, role = $2, unit_id = $3, active = $4, email = $5
           WHERE id = $6`,
          [profile.full_name, profile.role, profile.unit_id, profile.active, email, id],
        );
      } else {
        await pgClient.query(
          `UPDATE tpmps.profiles 
           SET full_name = $1, role = $2, unit_id = $3, active = $4
           WHERE id = $5`,
          [profile.full_name, profile.role, profile.unit_id, profile.active, id],
        );
      }

      // 2. If password provided, update auth.users
      if (password) {
        await pgClient.query(
          `UPDATE auth.users 
           SET encrypted_password = crypt($1, gen_salt('bf', 10)), updated_at = now()
           WHERE id = $2`,
          [password, id],
        );
      }

      // 3. If email provided, update auth.users and auth.identities
      if (email) {
        await pgClient.query(
          `UPDATE auth.users 
           SET email = $1, updated_at = now()
           WHERE id = $2`,
          [email, id],
        );
        await pgClient.query(
          `UPDATE auth.identities 
           SET email = $1, identity_data = json_build_object('sub', $2::text, 'email', $1::text)::jsonb, updated_at = now()
           WHERE user_id = $2`,
          [email, id],
        );
      }

      // 4. Update public.profiles if exists
      try {
        await pgClient.query(
          `UPDATE public.profiles 
           SET full_name = $1, unit_id = $2, is_active = $3, updated_at = now()
           ${email ? ", email = $5" : ""}
           WHERE id = $4`,
          email
            ? [profile.full_name, profile.unit_id, profile.active, id, email]
            : [profile.full_name, profile.unit_id, profile.active, id],
        );
      } catch {
        // Safe to ignore
      }
    });

    return Response.json({ id, message: "Pengguna berhasil diperbarui" });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { profile: caller } = await authorize(request);
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) throw new HttpError(400, "ID pengguna diperlukan");
    if (id === caller.id) {
      throw new HttpError(409, "Tidak dapat menghapus akun admin sendiri");
    }

    // Check if user has uploaded files
    const fileCount = await dbQuery(
      "SELECT count(*) as count FROM tpmps.files WHERE uploaded_by = $1",
      [id],
    );
    const count = parseInt(fileCount.rows[0]?.count || "0", 10);
    if (count > 0) {
      throw new HttpError(
        409,
        `Pengguna memiliki ${count} berkas arsip terkait. Ubah status menjadi 'Nonaktif' alih-alih menghapus.`,
      );
    }

    const admin = adminClient();
    if (admin) {
      await admin.from("profiles").delete().eq("id", id);
      await admin.auth.admin.deleteUser(id);
      return Response.json({ id, message: "Pengguna berhasil dihapus" });
    }

    await withTransaction(async (pgClient) => {
      await pgClient.query("DELETE FROM tpmps.profiles WHERE id = $1", [id]);
      try {
        await pgClient.query("DELETE FROM public.profiles WHERE id = $1", [id]);
      } catch {
        // ignore
      }
      await pgClient.query("DELETE FROM auth.identities WHERE user_id = $1", [id]);
      await pgClient.query("DELETE FROM auth.users WHERE id = $1", [id]);
    });

    return Response.json({ id, message: "Pengguna berhasil dihapus" });
  } catch (error) {
    return failure(error);
  }
}
