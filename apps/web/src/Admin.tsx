import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Pencil,
  ShieldCheck,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { api, db } from "./client";
import {
  roles,
  periodStatus,
  type Profile,
  type Unit,
  type Period,
} from "./domain";
import { SelectDropdown } from "./SelectDropdown";
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
                <SelectDropdown
                  name="role"
                  value={edit.role || "kepala_sekolah"}
                  onChange={(val) => setEdit({ ...edit, role: val })}
                  options={[
                    {
                      value: "superadmin",
                      label: roles.superadmin,
                      icon: <ShieldCheck size={16} style={{ color: "var(--accent, #016EC4)" }} />,
                      description: "Hak akses penuh seluruh sistem dan konfigurasi",
                    },
                    {
                      value: "kepala_sekolah",
                      label: roles.kepala_sekolah,
                      icon: <Award size={16} style={{ color: "#d97706" }} />,
                      description: "Memantau capaian mutu dan membaca seluruh berkas",
                    },
                    {
                      value: "ketua_tpmps",
                      label: roles.ketua_tpmps,
                      icon: <BookOpen size={16} style={{ color: "#2563eb" }} />,
                      description: "Koordinator penjaminan mutu dan struktur folder",
                    },
                    {
                      value: "kepala_unit",
                      label: roles.kepala_unit,
                      icon: <Building2 size={16} style={{ color: "#059669" }} />,
                      description: "Mengunggah dan mengelola berkas unit kerja",
                    },
                  ]}
                />
              </label>
              {edit.role === "kepala_unit" && (
                <label>
                  Unit penugasan
                  <SelectDropdown
                    name="unit_id"
                    value={edit.unit_id || ""}
                    onChange={(val) => setEdit({ ...edit, unit_id: val })}
                    placeholder="Pilih unit kerja aktif"
                    required
                    options={units
                      .filter((u) => u.active)
                      .map((u) => ({
                        value: u.id,
                        label: u.name,
                        icon: <Building2 size={15} style={{ color: "var(--muted)" }} />,
                      }))}
                  />
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
              <SelectDropdown
                name="active"
                value={String(edit.active !== false)}
                onChange={(val) => setEdit({ ...edit, active: val === "true" })}
                options={[
                  {
                    value: "true",
                    label: "Aktif",
                    icon: <CheckCircle2 size={16} style={{ color: "#16a34a" }} />,
                    description: "Dapat digunakan untuk operasional sistem",
                  },
                  {
                    value: "false",
                    label: "Nonaktif",
                    icon: <XCircle size={16} style={{ color: "#dc2626" }} />,
                    description: "Akses dibatasi sementara / arsip",
                  },
                ]}
              />
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
