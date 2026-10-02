import { useState } from "react";
import { ArrowLeft, Plus, Pencil } from "lucide-react";
import { api, db } from "./client";
import {
  roles,
  periodStatus,
  type Profile,
  type Unit,
  type Period,
} from "./domain";
type RecordRow = Record<string, any>;
export function Admin({
  section,
  profiles,
  units,
  periods,
  reload,
  report,
  now,
}: {
  section: string;
  profiles: Profile[];
  units: Unit[];
  periods: Period[];
  reload: () => Promise<void>;
  report: (message: string) => void;
  now: Date;
}) {
  const [edit, setEdit] = useState<RecordRow | null>(null);
  const [busy, setBusy] = useState(false);
  const rows: RecordRow[] =
    section === "users" ? profiles : section === "units" ? units : periods;
  const title =
    section === "users"
      ? "Pengguna"
      : section === "units"
        ? "Unit sekolah"
        : "Periode sekolah";
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      const body: RecordRow = { ...values, active: values.active === "true" };
      if (section === "users") {
        await api(
          "users",
          { ...body, id: edit?.id },
          edit?.id ? "PATCH" : "POST",
        );
      } else {
        const table = section === "units" ? "units" : "periods";
        const payload: RecordRow =
          section === "units"
            ? { name: body.name, active: body.active }
            : {
                name: body.name,
                starts_on: body.starts_on,
                ends_on: body.ends_on,
              };
        if (section === "periods" && body.starts_on > body.ends_on)
          throw new Error(
            "Tanggal mulai harus sebelum atau sama dengan tanggal selesai",
          );
        const query = edit?.id
          ? db.from(table).update(payload).eq("id", edit.id)
          : db.from(table).insert(payload);
        const { error } = await query;
        if (error) throw error;
      }
      await reload();
      setEdit(null);
      report("Data berhasil disimpan");
    } catch (e) {
      report(e instanceof Error ? e.message : "Gagal menyimpan data");
    } finally {
      setBusy(false);
    }
  }
  if (edit)
    return (
      <section className="admin-form">
        <button className="text-button" onClick={() => setEdit(null)}>
          <ArrowLeft size={17} />
          Kembali ke {title.toLowerCase()}
        </button>
        <h1>
          {edit.id ? "Edit" : "Tambah"} {title.toLowerCase()}
        </h1>
        <p className="muted">Kelola data dan akses arsip sekolah.</p>
        <form onSubmit={save}>
          <label>
            Nama{section === "users" ? " lengkap" : ""}
            <input
              name={section === "users" ? "full_name" : "name"}
              defaultValue={edit.full_name || edit.name || ""}
              required
              maxLength={160}
            />
          </label>
          {section === "users" && (
            <>
              <label>
                Peran
                <select
                  name="role"
                  value={edit.role || "kepala_sekolah"}
                  onChange={(e) => setEdit({ ...edit, role: e.target.value })}
                >
                  {Object.entries(roles).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {edit.role === "kepala_unit" && (
                <label>
                  Unit penugasan
                  <select
                    name="unit_id"
                    defaultValue={edit.unit_id || ""}
                    required
                  >
                    <option value="">Pilih unit aktif</option>
                    {units
                      .filter((u) => u.active)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              {!edit.id && (
                <>
                  <label>
                    Email login
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="off"
                    />
                  </label>
                  <label>
                    Kata sandi awal
                    <input
                      name="password"
                      type="password"
                      minLength={12}
                      maxLength={128}
                      required
                      autoComplete="new-password"
                    />
                    <small>
                      Minimal 12 karakter. Sampaikan melalui saluran yang aman.
                    </small>
                  </label>
                </>
              )}
            </>
          )}
          {section === "periods" ? (
            <div className="form-row">
              <label>
                Tanggal mulai
                <input
                  type="date"
                  name="starts_on"
                  required
                  defaultValue={edit.starts_on}
                />
              </label>
              <label>
                Tanggal selesai
                <input
                  type="date"
                  name="ends_on"
                  required
                  defaultValue={edit.ends_on}
                />
              </label>
            </div>
          ) : (
            <label>
              Status
              <select
                name="active"
                defaultValue={String(edit.active !== false)}
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </label>
          )}
          <p className="note">
            {section === "periods"
              ? "Tanggal akhir berlaku sampai 23.59.59 WIB. Periode selesai terkunci permanen."
              : "Penonaktifan mempertahankan seluruh arsip. Penghapusan akun/unit berarsip tidak disediakan."}
          </p>
          <button className="primary" disabled={busy}>
            {busy ? "Menyimpan…" : "Simpan"}
          </button>
        </form>
      </section>
    );
  return (
    <>
      <div className="section-heading">
        <div>
          <h1>{title}</h1>
          <p className="muted">{rows.length} data terdaftar</p>
        </div>
        <button className="primary" onClick={() => setEdit({})}>
          <Plus size={18} />
          Tambah {title.toLowerCase()}
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>
                {section === "users"
                  ? "Peran"
                  : section === "periods"
                    ? "Rentang tanggal"
                    : "Status"}
              </th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.full_name || row.name}</td>
                <td>
                  {section === "users"
                    ? roles[row.role as keyof typeof roles]
                    : section === "periods"
                      ? `${row.starts_on} — ${row.ends_on}`
                      : row.active
                        ? "Aktif"
                        : "Nonaktif"}
                </td>
                <td>
                  <span className="badge">
                    {section === "periods"
                      ? periodStatus(row as Period,now)
                      : row.active
                        ? "Aktif"
                        : "Nonaktif"}
                  </span>
                </td>
                <td>
                  {(section !== "periods" ||
                    periodStatus(row as Period,now) !== "Selesai") && (
                    <button
                      aria-label={`Edit ${row.full_name || row.name}`}
                      onClick={() => setEdit(row)}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="empty">
            Belum ada data. Tambahkan {title.toLowerCase()} pertama.
          </div>
        )}
      </div>
    </>
  );
}
