import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Mail,
  Search,
  Lock,
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
  currentUserId,
}: {
  section: string;
  profiles: Profile[];
  units: Unit[];
  periods: Period[];
  reload: () => Promise<void>;
  report: (message: string) => void;
  now: Date;
  currentUserId?: string;
}) {
  const [edit, setEdit] = useState<RecordRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const rawRows: RecordRow[] =
    section === "users" ? profiles : section === "units" ? units : periods;

  // Filter users by search and role
  const rows = rawRows.filter((row) => {
    if (section !== "users") return true;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      (row.full_name && row.full_name.toLowerCase().includes(q)) ||
      (row.email && row.email.toLowerCase().includes(q)) ||
      (row.unit_id &&
        units
          .find((u) => u.id === row.unit_id)
          ?.name.toLowerCase()
          .includes(q));
    const matchRole = roleFilter === "all" || row.role === roleFilter;
    return matchSearch && matchRole;
  });

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
        if (body.role !== "kepala_unit") {
          body.unit_id = null;
        }

        if (edit?.id) {
          body.id = edit.id;
          if (!body.password) {
            delete body.password;
          } else if (String(body.password).length < 12) {
            throw new Error("Kata sandi baru minimal 12 karakter");
          }
          await api("users", body, "PATCH");
          report("Akun pengguna berhasil diperbarui");
        } else {
          if (!body.password || String(body.password).length < 12) {
            throw new Error("Kata sandi awal wajib diisi minimal 12 karakter");
          }
          await api("users", body, "POST");
          report("Akun pengguna baru berhasil dibuat");
        }
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
        if (section === "periods" && body.starts_on > body.ends_on) {
          throw new Error(
            "Tanggal mulai harus sebelum atau sama dengan tanggal selesai",
          );
        }
        const query = edit?.id
          ? db.from(table).update(payload).eq("id", edit.id)
          : db.from(table).insert(payload);
        const { error } = await query;
        if (error) throw error;
        report("Data berhasil disimpan");
      }

      await reload();
      setEdit(null);
    } catch (e) {
      report(e instanceof Error ? e.message : "Gagal menyimpan data");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteUser(row: RecordRow) {
    if (row.id === currentUserId) {
      report("Tidak dapat menghapus akun Anda sendiri");
      return;
    }
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus akun ${row.full_name} (${row.email || row.role})?\n\nCatatan: Akun hanya dapat dihapus permanen jika belum memiliki berkas arsip yang tersimpan.`,
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      await api(`users?id=${row.id}`, undefined, "DELETE");
      report("Pengguna berhasil dihapus");
      await reload();
    } catch (err) {
      report(err instanceof Error ? err.message : "Gagal menghapus pengguna");
    } finally {
      setBusy(false);
    }
  }

  const roleMeta = {
    superadmin: {
      color: "var(--accent, #016EC4)",
      bg: "rgba(1, 110, 196, 0.12)",
      icon: <ShieldCheck size={15} style={{ color: "var(--accent, #016EC4)" }} />,
    },
    kepala_sekolah: {
      color: "#d97706",
      bg: "rgba(217, 119, 6, 0.12)",
      icon: <Award size={15} style={{ color: "#d97706" }} />,
    },
    ketua_tpmps: {
      color: "#2563eb",
      bg: "rgba(37, 99, 235, 0.12)",
      icon: <BookOpen size={15} style={{ color: "#2563eb" }} />,
    },
    kepala_unit: {
      color: "#059669",
      bg: "rgba(5, 150, 105, 0.12)",
      icon: <Building2 size={15} style={{ color: "#059669" }} />,
    },
  };

  if (edit) {
    const isNewUser = section === "users" && !edit.id;
    return (
      <section className="admin-form">
        <button className="text-button" onClick={() => setEdit(null)}>
          <ArrowLeft size={17} />
          Kembali ke {title.toLowerCase()}
        </button>
        <h1>
          {edit.id ? "Edit" : "Tambah"}{" "}
          {section === "users" ? "Pengguna" : title.toLowerCase()}
        </h1>
        <p className="muted">
          {section === "users"
            ? "Kelola identitas akun, peran penjaminan mutu, dan hak akses operasional."
            : "Kelola data dan konfigurasi sistem penjaminan mutu."}
        </p>

        <form onSubmit={save}>
          <label>
            Nama{section === "users" ? " lengkap & gelar" : ""}
            <input
              name={section === "users" ? "full_name" : "name"}
              defaultValue={edit.full_name || edit.name || ""}
              placeholder={
                section === "users"
                  ? "cth: Drs. Bambang Prasetyo, M.Pd."
                  : "Nama unit / periode"
              }
              required
              maxLength={160}
            />
          </label>

          {section === "users" && (
            <>
              <label>
                Email login
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    name="email"
                    type="email"
                    defaultValue={edit.email || ""}
                    required
                    autoComplete="off"
                    placeholder="cth: nama@smkn2magelang.sch.id"
                    style={{ paddingLeft: 34 }}
                  />
                  <Mail
                    size={16}
                    style={{
                      position: "absolute",
                      left: 10,
                      color: "var(--muted)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                {edit.id && (
                  <small className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                    Email login pengguna untuk masuk ke sistem SINTESA-TPMPS.
                  </small>
                )}
              </label>

              <label>
                Peran sistem
                <SelectDropdown
                  name="role"
                  value={edit.role || "kepala_unit"}
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

              <label>
                {isNewUser ? "Kata sandi awal" : "Reset kata sandi (opsional)"}
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    minLength={12}
                    maxLength={128}
                    required={isNewUser}
                    autoComplete={isNewUser ? "new-password" : "off"}
                    placeholder={
                      isNewUser
                        ? "Minimal 12 karakter"
                        : "Kosongkan jika tidak ingin mengubah"
                    }
                    style={{ paddingLeft: 34, paddingRight: 40 }}
                  />
                  <Lock
                    size={16}
                    style={{
                      position: "absolute",
                      left: 10,
                      color: "var(--muted)",
                      pointerEvents: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 8,
                      background: "none",
                      border: "none",
                      padding: 6,
                      cursor: "pointer",
                      color: "var(--muted)",
                      display: "flex",
                      alignItems: "center",
                    }}
                    title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <small className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                  {isNewUser
                    ? "Minimal 12 karakter (contoh: Sintesa2026!#). Sampaikan melalui saluran yang aman."
                    : "Kosongkan jika kata sandi pengguna tidak perlu diubah. Minimal 12 karakter jika diisi."}
                </small>
              </label>
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
              Status operasional
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
              : "Penonaktifan mempertahankan seluruh arsip dokumen. Penghapusan akun hanya diizinkan jika belum memiliki berkas arsip."}
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button className="primary" disabled={busy}>
              {busy
                ? "Menyimpan…"
                : isNewUser
                  ? "Buat Pengguna Baru"
                  : "Simpan Perubahan"}
            </button>
            <button
              type="button"
              className="text-button"
              onClick={() => setEdit(null)}
              disabled={busy}
            >
              Batal
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <>
      <div className="section-heading">
        <div>
          <h1>{title}</h1>
          <p className="muted">
            {rawRows.length} data terdaftar
            {section === "users" && search && ` (ditemukan ${rows.length})`}
          </p>
        </div>
        <button
          className="primary"
          onClick={() =>
            setEdit(
              section === "users"
                ? { role: "kepala_unit", active: true }
                : {},
            )
          }
        >
          <Plus size={18} />
          Tambah {section === "users" ? "Pengguna" : title.toLowerCase()}
        </button>
      </div>

      {section === "users" && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: "1 1 240px",
              minWidth: 200,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                color: "var(--muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="search"
              placeholder="Cari nama, email, atau unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: 36,
                paddingRight: 12,
                height: 40,
                borderRadius: 6,
                background: "var(--panel)",
                border: "1px solid var(--border)",
                color: "inherit",
              }}
            />
          </div>

          <div style={{ width: 220 }}>
            <SelectDropdown
              value={roleFilter}
              onChange={(val) => setRoleFilter(val)}
              options={[
                { value: "all", label: "Semua Peran" },
                {
                  value: "superadmin",
                  label: roles.superadmin,
                  icon: <ShieldCheck size={15} style={{ color: "var(--accent, #016EC4)" }} />,
                },
                {
                  value: "kepala_sekolah",
                  label: roles.kepala_sekolah,
                  icon: <Award size={15} style={{ color: "#d97706" }} />,
                },
                {
                  value: "ketua_tpmps",
                  label: roles.ketua_tpmps,
                  icon: <BookOpen size={15} style={{ color: "#2563eb" }} />,
                },
                {
                  value: "kepala_unit",
                  label: roles.kepala_unit,
                  icon: <Building2 size={15} style={{ color: "#059669" }} />,
                },
              ]}
            />
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nama & Akun</th>
              {section === "users" && <th>Email</th>}
              <th>
                {section === "users"
                  ? "Peran"
                  : section === "periods"
                    ? "Rentang tanggal"
                    : "Status"}
              </th>
              {section === "users" && <th>Unit Kerja</th>}
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const meta =
                section === "users" && row.role
                  ? roleMeta[row.role as keyof typeof roleMeta]
                  : null;
              const assignedUnit =
                section === "users" && row.unit_id
                  ? units.find((u) => u.id === row.unit_id)
                  : null;

              return (
                <tr key={row.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {section === "users" && (
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: meta ? meta.bg : "var(--border)",
                            color: meta ? meta.color : "inherit",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                            fontSize: 12,
                            flexShrink: 0,
                          }}
                        >
                          {(row.full_name || row.name || "U")
                            .split(" ")
                            .map((s: string) => s[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 500 }}>
                          {row.full_name || row.name}
                        </div>
                        {section === "users" && row.id === currentUserId && (
                          <span
                            style={{
                              fontSize: 10,
                              background: "rgba(1, 110, 196, 0.15)",
                              color: "var(--accent, #016EC4)",
                              padding: "2px 6px",
                              borderRadius: 4,
                              fontWeight: 600,
                            }}
                          >
                            Akun Anda
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {section === "users" && (
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          color: "var(--muted)",
                        }}
                      >
                        <Mail size={13} style={{ flexShrink: 0 }} />
                        <span style={{ wordBreak: "break-all" }}>
                          {row.email || "-"}
                        </span>
                      </div>
                    </td>
                  )}

                  <td>
                    {section === "users" ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 8px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          background: meta ? meta.bg : "var(--panel)",
                          color: meta ? meta.color : "inherit",
                        }}
                      >
                        {meta?.icon}
                        {roles[row.role as keyof typeof roles]}
                      </span>
                    ) : section === "periods" ? (
                      `${row.starts_on} — ${row.ends_on}`
                    ) : row.active ? (
                      "Aktif"
                    ) : (
                      "Nonaktif"
                    )}
                  </td>

                  {section === "users" && (
                    <td>
                      {assignedUnit ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 12,
                            color: "var(--text)",
                          }}
                        >
                          <Building2 size={13} style={{ color: "var(--muted)" }} />
                          {assignedUnit.name}
                        </span>
                      ) : (
                        <span className="muted" style={{ fontSize: 12 }}>
                          -
                        </span>
                      )}
                    </td>
                  )}

                  <td>
                    <span
                      className="badge"
                      style={{
                        background:
                          row.active ||
                          (section === "periods" &&
                            periodStatus(row as Period, now) === "Aktif")
                            ? "rgba(22, 163, 74, 0.15)"
                            : "rgba(220, 38, 38, 0.15)",
                        color:
                          row.active ||
                          (section === "periods" &&
                            periodStatus(row as Period, now) === "Aktif")
                            ? "#16a34a"
                            : "#dc2626",
                        fontWeight: 600,
                        padding: "4px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {section === "periods"
                        ? periodStatus(row as Period, now)
                        : row.active
                          ? "Aktif"
                          : "Nonaktif"}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {(section !== "periods" ||
                        periodStatus(row as Period, now) !== "Selesai") && (
                        <button
                          aria-label={`Edit ${row.full_name || row.name}`}
                          onClick={() => setEdit(row)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                      )}

                      {section === "users" && row.id !== currentUserId && (
                        <button
                          aria-label={`Hapus ${row.full_name}`}
                          onClick={() => void handleDeleteUser(row)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            color: "#dc2626",
                            borderColor: "rgba(220, 38, 38, 0.3)",
                          }}
                          disabled={busy}
                          title="Hapus akun pengguna jika belum memiliki berkas"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!rows.length && (
          <div className="empty">
            {search || roleFilter !== "all"
              ? "Tidak ada pengguna yang cocok dengan filter pencarian."
              : `Belum ada data. Tambahkan ${title.toLowerCase()} pertama.`}
          </div>
        )}
      </div>
    </>
  );
}
