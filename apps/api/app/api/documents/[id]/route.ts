import {
  authorizeReader,
  failure,
  HttpError,
  text,
} from "../../../../lib/auth";
import { dbQuery } from "../../../../lib/db";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await authorizeReader(request);
    const { id } = await props.params;

    const result = await dbQuery(
      `SELECT * FROM tpmps.v_document_directory WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new HttpError(404, "Dokumen tidak ditemukan");
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    return failure(error);
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { client, profile } = await authorizeReader(request);
    const { id } = await props.params;
    const body = await request.json();

    const nomor_dokumen = text(body.nomor_dokumen, "Nomor Dokumen", 100);
    const nama_dokumen = text(body.nama_dokumen, "Nama Dokumen", 255);
    const unit = text(body.unit, "Unit", 160);
    const letak_dokumen = text(body.letak_dokumen, "Letak Dokumen", 500);
    const unit_id = typeof body.unit_id === "string" && body.unit_id.trim() ? body.unit_id.trim() : null;
    const file_path = typeof body.file_path === "string" && body.file_path.trim() ? body.file_path.trim() : null;
    const file_id = typeof body.file_id === "string" && body.file_id.trim() ? body.file_id.trim() : null;

    if (profile.role === "kepala_unit" && profile.unit_id && unit_id !== profile.unit_id) {
      throw new HttpError(403, "Anda hanya dapat mengedit dokumen untuk unit Anda sendiri");
    }

    const { data, error } = await client
      .from("documents")
      .update({
        nomor_dokumen,
        nama_dokumen,
        unit,
        unit_id,
        letak_dokumen,
        file_path,
        file_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new HttpError(400, error.message || "Gagal memperbarui dokumen");
    }

    return Response.json(data);
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { client, profile } = await authorizeReader(request);
    const { id } = await props.params;

    if (!["superadmin", "ketua_tpmps"].includes(profile.role)) {
      throw new HttpError(403, "Hanya Superadmin atau Ketua TPMPS yang dapat menghapus dokumen direktori");
    }

    const { error } = await client.from("documents").delete().eq("id", id);
    if (error) {
      throw new HttpError(400, error.message || "Gagal menghapus dokumen");
    }

    return Response.json({ success: true, message: "Dokumen berhasil dihapus" });
  } catch (error) {
    return failure(error);
  }
}
