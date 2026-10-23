import {
  authorizeReader,
  failure,
  HttpError,
  text,
} from "../../../lib/auth";
import { dbQuery } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { profile } = await authorizeReader(request);
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim() || "";
    const unit = url.searchParams.get("unit")?.trim() || "";
    const status = url.searchParams.get("status")?.trim() || "";

    const conditions: string[] = ["1=1"];
    const params: any[] = [];

    // Filter by unit if user is kepala_unit (unless all-units read is allowed)
    if (profile.role === "kepala_unit" && profile.unit_id) {
      params.push(profile.unit_id);
      conditions.push(`(unit_id = $${params.length})`);
    } else if (unit && unit !== "all") {
      params.push(unit);
      conditions.push(`(unit = $${params.length} OR unit_id::text = $${params.length})`);
    }

    if (status && status !== "all") {
      params.push(status);
      conditions.push(`status_approval = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      const idx = params.length;
      conditions.push(
        `(nama_dokumen ILIKE $${idx} OR nomor_dokumen ILIKE $${idx} OR letak_dokumen ILIKE $${idx} OR unit ILIKE $${idx})`
      );
    }

    const sql = `
      SELECT *
      FROM tpmps.v_document_directory
      WHERE ${conditions.join(" AND ")}
      ORDER BY created_at DESC
    `;

    const result = await dbQuery(sql, params);
    return Response.json(result.rows);
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  try {
    const { client, profile } = await authorizeReader(request);
    const body = await request.json();

    const nomor_dokumen = text(body.nomor_dokumen, "Nomor Dokumen", 100);
    const nama_dokumen = text(body.nama_dokumen, "Nama Dokumen", 255);
    const unit = text(body.unit, "Unit", 160);
    const letak_dokumen = text(body.letak_dokumen, "Letak Dokumen", 500);
    const unit_id = typeof body.unit_id === "string" && body.unit_id.trim() ? body.unit_id.trim() : null;
    const file_path = typeof body.file_path === "string" && body.file_path.trim() ? body.file_path.trim() : null;
    const file_id = typeof body.file_id === "string" && body.file_id.trim() ? body.file_id.trim() : null;

    // Validate unit for kepala_unit
    if (profile.role === "kepala_unit" && profile.unit_id && unit_id !== profile.unit_id) {
      throw new HttpError(403, "Anda hanya dapat menambahkan dokumen untuk unit Anda sendiri");
    }

    const { data, error } = await client
      .from("documents")
      .insert({
        nomor_dokumen,
        nama_dokumen,
        unit,
        unit_id,
        letak_dokumen,
        file_path,
        file_id,
        created_by: profile.id,
      })
      .select()
      .single();

    if (error) {
      throw new HttpError(400, error.message || "Gagal menyimpan data dokumen");
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    return failure(error);
  }
}
