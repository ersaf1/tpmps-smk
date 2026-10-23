import {
  authorizeAuditor,
  authorizeReader,
  failure,
  HttpError,
  text,
} from "../../../lib/auth";
import { dbQuery } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await authorizeReader(request);
    const url = new URL(request.url);
    const documentId = url.searchParams.get("document_id")?.trim();

    if (documentId) {
      const result = await dbQuery(
        `SELECT a.*, p.full_name as profile_auditor_name 
         FROM tpmps.audits a 
         LEFT JOIN tpmps.profiles p ON p.id = a.auditor_id 
         WHERE a.document_id = $1 
         ORDER BY a.created_at DESC`,
        [documentId]
      );
      return Response.json(result.rows);
    }

    const result = await dbQuery(
      `SELECT a.*, d.nomor_dokumen, d.nama_dokumen, d.unit 
       FROM tpmps.audits a 
       JOIN tpmps.documents d ON d.id = a.document_id 
       ORDER BY a.created_at DESC 
       LIMIT 100`
    );
    return Response.json(result.rows);
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  try {
    const { client, profile } = await authorizeAuditor(request);
    const body = await request.json();

    const document_id = text(body.document_id, "ID Dokumen", 64);
    const status_approval = text(body.status_approval, "Status Approval", 20);

    if (!["approved", "revisi", "pending"].includes(status_approval)) {
      throw new HttpError(400, "Status approval harus approved, revisi, atau pending");
    }

    const kelebihan = typeof body.kelebihan === "string" ? body.kelebihan.trim() : "";
    const kekurangan = typeof body.kekurangan === "string" ? body.kekurangan.trim() : "";
    
    // Auto fill nama_auditor from profile full_name if not provided
    const nama_auditor = typeof body.nama_auditor === "string" && body.nama_auditor.trim() 
      ? body.nama_auditor.trim() 
      : profile.full_name;

    const tanggal_audit = typeof body.tanggal_audit === "string" && body.tanggal_audit.trim()
      ? body.tanggal_audit.trim()
      : new Date().toISOString().split("T")[0];

    // Insert new audit record (or update latest for the document)
    const { data, error } = await client
      .from("audits")
      .insert({
        document_id,
        status_approval,
        kelebihan,
        kekurangan,
        nama_auditor,
        auditor_id: profile.id,
        tanggal_audit,
      })
      .select()
      .single();

    if (error) {
      throw new HttpError(400, error.message || "Gagal menyimpan hasil audit");
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    return failure(error);
  }
}
