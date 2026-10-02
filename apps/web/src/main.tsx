import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard,
  Folder,
  FolderOpen,
  Files,
  Search,
  Sun,
  Moon,
  LogOut,
  Users,
  Building2,
  CalendarDays,
  ChevronRight,
  Grid2X2,
  List,
  Plus,
  UploadCloud,
  Download,
  FileText,
  Image,
  ArrowUpDown,
  Menu,
  HardDrive,
  ShieldCheck,
  LockKeyhole,
  Pencil,
  Move,
  Trash2,
  X,
  User,
  RefreshCw,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { db, configured, allRows } from "./client";
import {
  roles,
  bytes,
  canWrite,
  periodStatus,
  safePreview,
  type Profile,
  type Unit,
  type Period,
  type Space,
  type Folder as FolderRow,
  type Doc,
} from "./domain";
import { Admin } from "./Admin";
import { Modal } from "./Modal";
import { Upload } from "./Upload";
import { Thumbnail } from "./Thumbnail";
import "./styles.css";
import "./reference-layout.css";
type Action = {
  kind: "folder" | "upload" | "rename" | "move" | "delete" | "preview";
  target?: FolderRow | Doc;
  url?: string;
};
const date = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
function App() {
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "dark",
  );
  const [session, setSession] = useState<Session | null>(null);
  const [initial, setInitial] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]),
    [units, setUnits] = useState<Unit[]>([]),
    [spaces, setSpaces] = useState<Space[]>([]),
    [folders, setFolders] = useState<FolderRow[]>([]),
    [files, setFiles] = useState<Doc[]>([]),
    [profiles, setProfiles] = useState<Profile[]>([]);
  const [periodId, setPeriodId] = useState(""),
    [spaceId, setSpaceId] = useState(""),
    [folderId, setFolderId] = useState<string | null>(null),
    [page, setPage] = useState("dashboard");
  const [query, setQuery] = useState(""),
    [view, setView] = useState("grid"),
    [sort, setSort] = useState("date"),
    [type, setType] = useState("all");
  const [drawer, setDrawer] = useState(false),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [action, setAction] = useState<Action | null>(null),
    [busy, setBusy] = useState(false),
    [clock, setClock] = useState(new Date());
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("tpmps-theme", next);
  };
  const report = (message: string) => setNotice(message);
  useEffect(() => {
    db.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setInitial(false);
    });
    const { data } = db.auth.onAuthStateChange((_event, next) =>
      setSession(next),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  async function reload() {
    setLoading(true);
    setError("");
    try {
      const { data: user } = await db.auth.getUser();
      if (!user.user) throw new Error("Sesi berakhir. Silakan login kembali.");
      const { data: p, error: pe } = await db
        .from("profiles")
        .select("*")
        .eq("id", user.user.id)
        .single();
      if (pe || !p?.active) {
        setProfile(null);
        throw new Error(
          "Akun belum memiliki profil aktif. Hubungi superadmin.",
        );
      }
      const [ps, us, ss, fs, ds, pr, now] = await Promise.all([
        allRows<Period>("periods"),
        allRows<Unit>("units"),
        allRows<Space>("document_spaces"),
        allRows<FolderRow>("folders"),
        allRows<Doc>("files"),
        allRows<Profile>("profiles"),
        db.rpc("server_clock"),
      ]);
      if (now.error) throw now.error;
      const { data: currentSession } = await db.auth.getSession();
      if (currentSession.session?.user.id !== p.id) return;
      setProfile(p);
      setClock(new Date(now.data));
      setPeriods(ps.sort((a, b) => b.starts_on.localeCompare(a.starts_on)));
      setUnits(us);
      setSpaces(ss);
      setFolders(fs);
      setFiles(ds);
      setProfiles(pr);
      setPeriodId((old) =>
        ps.some((p) => p.id === old) ? old : ps[0]?.id || "",
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Gagal memuat data. Periksa koneksi dan migrasi database.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    setProfile(null);
    setAction(null);
    setFiles([]);
    setFolders([]);
    setProfiles([]);
    setPage("dashboard");
    if (session) void reload();
  }, [session?.user.id]);
  useEffect(() => {
    if (!session) return;
    const timer = window.setInterval(() => void reload(), 60000);
    return () => clearInterval(timer);
  }, [session?.user.id]);
  useEffect(() => {
    setFolderId(null);
  }, [periodId]);
  useEffect(() => {
    setSpaceId((old) =>
      spaces.some((s) => s.id === old && s.period_id === periodId)
        ? old
        : spaces.find((s) => s.period_id === periodId)?.id || "",
    );
  }, [periodId, spaces]);
  useEffect(() => {
    if (!action?.url) return;
    return () => URL.revokeObjectURL(action.url!);
  }, [action]);
  const period = periods.find((p) => p.id === periodId),
    space = spaces.find((s) => s.id === spaceId);
  const status = period ? periodStatus(period, clock) : "";
  const writable =
    !!profile &&
    canWrite(profile, space, period, clock) &&
    (!space?.unit_id || units.some((u) => u.id === space.unit_id && u.active));
  const periodSpaces = spaces.filter((s) => s.period_id === periodId);
  const periodFiles = files.filter(
    (f) =>
      f.status === "ready" && periodSpaces.some((s) => s.id === f.space_id),
  );
  const spaceFolders = folders.filter((f) => f.space_id === spaceId);
  const currentFolder = folders.find((f) => f.id === folderId);
  const shownFolders = spaceFolders
    .filter((f) =>
      query
        ? f.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        : f.parent_id === folderId,
    )
    .sort((a, b) =>
      sort === "date"
        ? b.created_at.localeCompare(a.created_at)
        : a.name.localeCompare(b.name),
    );
  const shownFiles = periodFiles
    .filter(
      (f) =>
        (page === "dashboard" ||
          (f.space_id === spaceId && (query || f.folder_id === folderId))) &&
        f.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) &&
        (type === "all" ||
          (type === "pdf"
            ? f.mime_type === "application/pdf"
            : type === "image"
              ? f.mime_type.startsWith("image/")
              : !f.mime_type.startsWith("image/") &&
                f.mime_type !== "application/pdf")),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "size"
          ? b.size - a.size
          : b.created_at.localeCompare(a.created_at),
    );
  const trail: FolderRow[] = [];
  let parent = currentFolder;
  while (parent && !trail.some((f) => f.id === parent?.id)) {
    trail.unshift(parent);
    parent = folders.find((f) => f.id === parent?.parent_id);
  }
  function navigate(next: string) {
    setPage(next);
    setDrawer(false);
    setQuery("");
  }
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const { error } = await db.auth.signInWithPassword({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      if (error) throw error;
    } catch {
      setError("Login gagal. Periksa email, kata sandi, dan koneksi Supabase.");
    } finally {
      setBusy(false);
    }
  }
  async function openFile(file: Doc, download = false) {
    try {
      const { data, error } = await db.storage
        .from("tpmps-documents")
        .download(file.object_key);
      if (error) throw error;
      const url = URL.createObjectURL(
        new Blob([data], {
          type: safePreview(file.mime_type)
            ? file.mime_type
            : "application/octet-stream",
        }),
      );
      if (download) {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = file.name;
        anchor.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else setAction({ kind: "preview", target: file, url });
    } catch {
      report("File gagal dibuka. Periksa akses, koneksi, atau status file.");
    }
  }
  async function mutate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action) return;
    setBusy(true);
    try {
      const form = new FormData(event.currentTarget),
        target = action.target;
      const table = target && "object_key" in target ? "files" : "folders";
      let result;
      if (action.kind === "folder")
        result = await db.from("folders").insert({
          name: String(form.get("name")).trim(),
          space_id: spaceId,
          parent_id: folderId,
        });
      if (action.kind === "rename")
        result = await db
          .from(table)
          .update({ name: String(form.get("name")).trim() })
          .eq("id", target!.id)
          .select()
          .single();
      if (action.kind === "move")
        result = await db
          .from(table)
          .update({
            [table === "files" ? "folder_id" : "parent_id"]:
              form.get("destination") || null,
          })
          .eq("id", target!.id)
          .select()
          .single();
      if (action.kind === "delete") {
        if (table === "files") {
          result = await db.storage
            .from("tpmps-documents")
            .remove([(target as Doc).object_key]);
          if(!result.error&&!result.data?.some(object=>object.name===(target as Doc).object_key))throw new Error('File belum terhapus. Periksa izin dan status periode.');
        } else
          result = await db
            .from("folders")
            .delete()
            .eq("id", target!.id)
            .select()
            .single();
      }
      if (result?.error) throw result.error;
      setAction(null);
      await reload();
      report("Perubahan berhasil disimpan");
    } catch (e) {
      report(
        e instanceof Error
          ? e.message
          : "Operasi ditolak. Pastikan izin, periode aktif, dan folder kosong.",
      );
    } finally {
      setBusy(false);
    }
  }
  const themeButton = (
    <button
      className="icon-button"
      aria-label={
        theme === "dark" ? "Aktifkan tema terang" : "Aktifkan tema gelap"
      }
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
  if (initial) return <div className="loading-screen">Memuat sesi…</div>;
  if (!session)
    return (
      <div className="login-page">
        <div className="login-top">
          <div className="brand">
            <img src="/school-logo.png" alt="Logo sekolah" />
            <span>
              TPMPS<span className="brand-sub">Arsip mutu sekolah</span>
            </span>
          </div>
          {themeButton}
        </div>
        <div className="login-layout">
          <section className="login-intro">
            <div className="eyebrow">RUANG DOKUMEN SEKOLAH</div>
            <h1>
              Dokumen tertata.
              <br />
              Mutu terjaga.
            </h1>
            <p>
              Satu tempat untuk menyimpan, menemukan, dan menjaga arsip mutu
              sekolah dari setiap periode.
            </p>
            <div className="archive-art" aria-hidden="true">
              <div className="art-card">
                <Folder size={60} strokeWidth={1} />
                <div>
                  <strong>Arsip mutu</strong>
                  <span>Manual · Prosedur · Catatan · Petunjuk</span>
                </div>
                <ShieldCheck size={25} />
              </div>
              <div className="art-line" />
              <div className="art-mini">
                <span>
                  <LockKeyhole size={18} />
                  Akses sesuai peran
                </span>
                <span>
                  <CalendarDays size={18} />
                  Arsip per periode
                </span>
              </div>
            </div>
          </section>
          <section className="login-card">
            <span className="eyebrow">SELAMAT DATANG</span>
            <h2>Sistem Informasi TPMPS</h2>
            <p className="muted">Masuk dengan akun yang diberikan sekolah.</p>
            <form onSubmit={login}>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="nama@sekolah.sch.id"
                  autoComplete="username"
                  required
                />
              </label>
              <label>
                Kata sandi
                <input
                  type="password"
                  name="password"
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                  required
                />
              </label>
              {(!configured || error) && (
                <p className="error" role="alert">
                  {error ||
                    "Supabase belum dikonfigurasi. Lengkapi environment untuk login."}
                </p>
              )}
              <button
                className="primary login-submit"
                disabled={busy || !configured}
              >
                {busy ? "Memeriksa akun…" : "Masuk"}
                <ChevronRight size={18} />
              </button>
            </form>
            <p className="login-help">
              <ShieldCheck size={16} />
              Akun dikelola oleh superadmin sekolah.
            </p>
          </section>
        </div>
        <footer>
          Sistem Informasi TPMPS <span>Arsip internal sekolah</span>
        </footer>
      </div>
    );
  if (!profile)
    return (
      <div className="loading-screen">
        <h2>{loading ? "Memuat profil…" : "Akun belum dapat digunakan"}</h2>
        <p className="error">{error}</p>
        <button onClick={() => void reload()}>Coba lagi</button>
        <button onClick={() => void db.auth.signOut()}>Keluar</button>
      </div>
    );
  const actions = (target: FolderRow | Doc) => (
    <div className="row-actions">
      {"object_key" in target && (
        <button
          aria-label={`Download ${target.name}`}
          onClick={() => void openFile(target, true)}
        >
          <Download size={16} />
        </button>
      )}
      {writable && (
        <>
          <button
            aria-label={`Ubah nama ${target.name}`}
            onClick={() => setAction({ kind: "rename", target })}
          >
            <Pencil size={15} />
          </button>
          <button
            aria-label={`Pindahkan ${target.name}`}
            onClick={() => setAction({ kind: "move", target })}
          >
            <Move size={15} />
          </button>
          <button
            aria-label={`Hapus ${target.name}`}
            onClick={() => setAction({ kind: "delete", target })}
          >
            <Trash2 size={15} />
          </button>
        </>
      )}
    </div>
  );
  const fileTable = (rows: Doc[]) => (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nama file</th>
            <th>Ruang / unit</th>
            <th>Ukuran</th>
            <th>Pengunggah</th>
            <th>Ditambahkan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((file) => (
            <tr key={file.id}>
              <td>
                <button
                  className="file-name text-button"
                  onClick={() => void openFile(file)}
                >
                  <span className="file-icon">
                    {file.mime_type.startsWith("image/") ? (
                      <Image size={20} />
                    ) : (
                      <FileText size={20} />
                    )}
                  </span>
                  {file.name}
                </button>
              </td>
              <td>{spaces.find((s) => s.id === file.space_id)?.name}</td>
              <td>{bytes(file.size)}</td>
              <td>
                {profiles.find((p) => p.id === file.uploaded_by)?.full_name ||
                  "Pengguna sekolah"}
              </td>
              <td>{date(file.created_at)}</td>
              <td>
                {page === "dashboard" ? (
                  <button
                    aria-label={`Download ${file.name}`}
                    onClick={() => void openFile(file, true)}
                  >
                    <Download size={16} />
                  </button>
                ) : (
                  actions(file)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <div className="empty">
          <Files size={32} />
          <h3>Belum ada dokumen</h3>
          <p>Dokumen yang dapat Anda akses akan tampil di sini.</p>
        </div>
      )}
    </div>
  );
  return (
    <div className="app-shell">
      {drawer && (
        <button
          className="drawer-backdrop"
          aria-label="Tutup navigasi"
          onClick={() => setDrawer(false)}
        />
      )}
      <aside className={drawer ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <img src="/school-logo.png" alt="Logo sekolah" />
          <span>
            TPMPS<span className="brand-sub">Arsip mutu sekolah</span>
          </span>
          <button
            className="mobile-close"
            aria-label="Tutup menu"
            onClick={() => setDrawer(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          <button
            className={page === "dashboard" ? "selected" : ""}
            onClick={() => navigate("dashboard")}
          >
            <LayoutDashboard />
            Dashboard
          </button>
          <button
            className={page === "files" ? "selected" : ""}
            onClick={() => navigate("files")}
          >
            <FolderOpen />
            File Manager
          </button>
          {profile.role !== "kepala_unit" && (
            <button
              className={page === "spaces" ? "selected" : ""}
              onClick={() => navigate("spaces")}
            >
              <Building2 />
              Dokumen seluruh unit
            </button>
          )}
        </nav>
        <div className="nav-label">RUANG DOKUMEN</div>
        <nav className="space-nav">
          {periodSpaces.map((s) => (
            <React.Fragment key={s.id}>
              <button
                className={
                  page === "files" && spaceId === s.id ? "space-selected" : ""
                }
                onClick={() => {
                  setSpaceId(s.id);
                  setFolderId(null);
                  navigate("files");
                }}
              >
                <Folder size={18} />
                <span>{s.name}</span>
                <ChevronRight size={14} />
              </button>
              {page === "files" &&
                spaceId === s.id &&
                spaceFolders
                  .filter((f) => !f.parent_id)
                  .map((f) => (
                    <button
                      key={f.id}
                      className={`subnav ${folderId === f.id ? "space-selected" : ""}`}
                      onClick={() => {
                        setFolderId(f.id);
                        setQuery("");
                        setDrawer(false);
                      }}
                    >
                      <ChevronRight size={13} />
                      <span>{f.name}</span>
                    </button>
                  ))}
            </React.Fragment>
          ))}
        </nav>
        {profile.role === "superadmin" && (
          <>
            <div className="nav-label">ADMINISTRASI</div>
            <nav>
              {[
                ["users", "Pengguna", Users],
                ["units", "Unit sekolah", Building2],
                ["periods", "Periode", CalendarDays],
              ].map(([id, label, Icon]) => (
                <button
                  key={String(id)}
                  className={page === id ? "selected" : ""}
                  onClick={() => navigate(String(id))}
                >
                  <Icon size={19} />
                  {String(label)}
                </button>
              ))}
            </nav>
          </>
        )}
        <div className="storage">
          <HardDrive size={21} />
          <strong>Penyimpanan arsip</strong>
          <p>
            {bytes(periodFiles.reduce((sum, f) => sum + f.size, 0))} ·{" "}
            {periodFiles.length} file dapat diakses
          </p>
          <span>Bucket privat · Akses terlindungi</span>
        </div>
        <button className="logout" onClick={() => void db.auth.signOut()}>
          <LogOut size={18} />
          Keluar
        </button>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Buka menu"
            onClick={() => setDrawer(true)}
          >
            <Menu />
          </button>
          <div className="search">
            <Search size={19} />
            <input
              aria-label="Cari file dan folder"
              placeholder="Cari file dan folder…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!["files", "dashboard"].includes(page)) setPage("files");
              }}
            />
            {query && (
              <button aria-label="Hapus pencarian" onClick={() => setQuery("")}>
                <X size={15} />
              </button>
            )}
          </div>
          <div className="topbar-account">
            {themeButton}
            <button
              className="profile-button"
              onClick={() => navigate("profile")}
            >
              <span className="avatar">{profile.full_name.slice(0, 1)}</span>
              <span>
                {profile.full_name}
                <small>{roles[profile.role]}</small>
              </span>
            </button>
          </div>
        </header>
        <main className={`page-${page}`}>
          <div className="context-row">
            <span>
              Workspace <ChevronRight size={13} />{" "}
              {page === "dashboard"
                ? "Dashboard"
                : page === "files"
                  ? "File Manager"
                  : page === "spaces"
                    ? "Seluruh unit"
                    : page === "profile"
                      ? "Profil"
                      : "Administrasi"}
            </span>
            <div className="period-picker">
              <CalendarDays size={16} />
              <select
                aria-label="Pilih periode"
                value={periodId}
                onChange={(e) => setPeriodId(e.target.value)}
              >
                {!periods.length && <option value="">Belum ada periode</option>}
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {period && (
                <span className={`badge ${status === "Aktif" ? "active" : ""}`}>
                  {status}
                </span>
              )}
            </div>
          </div>
          {status === "Selesai" && (
            <div className="archive-banner">
              <LockKeyhole size={17} />
              Periode selesai — hanya baca
            </div>
          )}
          {status === "Belum dimulai" && (
            <div className="archive-banner">
              <CalendarDays size={17} />
              Periode belum dimulai — dokumen hanya dapat dibaca
            </div>
          )}
          {error && (
            <div className="error" role="alert">
              {error}
              <button onClick={() => void reload()}>Coba lagi</button>
            </div>
          )}
          {notice && (
            <div className="toast" role="status">
              {notice}
              <button
                aria-label="Tutup pemberitahuan"
                onClick={() => setNotice("")}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {loading && <div className="loading-bar" aria-label="Memuat data" />}
          {page === "dashboard" && (
            <>
              <div className="section-heading">
                <div>
                  <h1>Dashboard</h1>
                  <p className="muted">
                    Selamat datang, {profile.full_name}. Berikut arsip mutu
                    sekolah Anda.
                  </p>
                </div>
                <button
                  onClick={() => void reload()}
                  aria-label="Segarkan data"
                >
                  <RefreshCw size={17} />
                  Segarkan
                </button>
              </div>
              <div className="stats">
                {(
                  [
                    ["Total dokumen", periodFiles.length, Files],
                    [
                      "Folder",
                      folders.filter((f) =>
                        periodSpaces.some((s) => s.id === f.space_id),
                      ).length,
                      Folder,
                    ],
                    ["Ruang dokumen", periodSpaces.length, Building2],
                    [
                      "Penyimpanan",
                      bytes(periodFiles.reduce((sum, f) => sum + f.size, 0)),
                      HardDrive,
                    ],
                  ] as const
                ).map(([label, value, Icon]) => (
                  <div className="stat" key={String(label)}>
                    <span className="stat-icon">
                      <Icon size={23} />
                    </span>
                    <span>
                      {String(label)}
                      <strong>{String(value)}</strong>
                    </span>
                  </div>
                ))}
              </div>
              {!periodSpaces.length && (
                <div className="empty compact">
                  Belum ada ruang dokumen. Superadmin dapat menambahkan periode
                  dan unit.
                </div>
              )}
              <div className="section-heading small">
                <h2>Dokumen terbaru</h2>
              </div>
              <div className="recent-grid">
                {shownFiles.slice(0, 4).map((f) => (
                  <button
                    className="recent-card"
                    key={f.id}
                    onClick={() => void openFile(f)}
                  >
                    <div className="document-cover">
                      <Thumbnail file={f} />
                      <span>{f.name.split(".").pop()?.toUpperCase()}</span>
                    </div>
                    <strong>{f.name}</strong>
                    <small>
                      {bytes(f.size)} · {date(f.created_at)}
                    </small>
                  </button>
                ))}
              </div>
              <div className="section-heading small">
                <h2>File terbaru</h2>
                <span className="muted">Sesuai hak akses Anda</span>
              </div>
              {fileTable(shownFiles.slice(0, 10))}
            </>
          )}
          {page === "spaces" && (
            <>
              <div className="section-heading">
                <div>
                  <h1>Dokumen seluruh unit</h1>
                  <p className="muted">
                    Telusuri arsip berdasarkan ruang pemilik dokumen.
                  </p>
                </div>
              </div>
              <div className="folder-grid">
                {periodSpaces.map((s) => (
                  <button
                    className="folder-card"
                    key={s.id}
                    onClick={() => {
                      setSpaceId(s.id);
                      setFolderId(null);
                      navigate("files");
                    }}
                  >
                    <Folder size={48} strokeWidth={1.2} />
                    <strong>{s.name}</strong>
                    <small>
                      {periodFiles.filter((f) => f.space_id === s.id).length}{" "}
                      dokumen
                      <ChevronRight size={14} />
                    </small>
                  </button>
                ))}
              </div>
            </>
          )}
          {page === "files" && (
            <>
              <div className="section-heading">
                <div>
                  <h1>
                    {currentFolder?.name || space?.name || "File Manager"}
                  </h1>
                  <p className="muted">
                    {shownFolders.length} folder · {shownFiles.length} file
                    {!writable ? " · Hanya baca" : ""}
                  </p>
                </div>
              </div>
              <div className="file-toolbar">
                <div className="breadcrumbs">
                  <button
                    onClick={() => {
                      setFolderId(null);
                      setQuery("");
                    }}
                  >
                    <FolderOpen size={17} />
                    {space?.name || "Ruang"}
                  </button>
                  {trail.map((f) => (
                    <React.Fragment key={f.id}>
                      <ChevronRight size={14} />
                      <button
                        onClick={() => {
                          setFolderId(f.id);
                          setQuery("");
                        }}
                      >
                        {f.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                <div className="toolbar-actions">
                  <label className="select-control">
                    <ArrowUpDown size={15} />
                    <select
                      aria-label="Urutkan"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="date">Terbaru</option>
                      <option value="name">Nama A–Z</option>
                      <option value="size">Ukuran</option>
                    </select>
                  </label>
                  <div className="view-switch">
                    <button
                      aria-label="Tampilan grid"
                      aria-pressed={view === "grid"}
                      onClick={() => setView("grid")}
                    >
                      <Grid2X2 size={17} />
                    </button>
                    <button
                      aria-label="Tampilan daftar"
                      aria-pressed={view === "list"}
                      onClick={() => setView("list")}
                    >
                      <List size={18} />
                    </button>
                  </div>
                  {writable && (
                    <>
                      <button onClick={() => setAction({ kind: "folder" })}>
                        <Plus size={17} />
                        Folder baru
                      </button>
                      {folderId && (
                        <button
                          className="primary"
                          onClick={() => setAction({ kind: "upload" })}
                        >
                          <UploadCloud size={18} />
                          Unggah file
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="filter-row">
                <select
                  aria-label="Filter jenis file"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="all">Semua jenis file</option>
                  <option value="pdf">PDF</option>
                  <option value="image">Gambar</option>
                  <option value="other">Dokumen lainnya</option>
                </select>
                {query && (
                  <span className="muted">Hasil pencarian dalam ruang ini</span>
                )}
              </div>
              {view === "grid" ? (
                <div className="folder-grid">
                  {shownFolders.map((f) => (
                    <div className="folder-card" key={f.id}>
                      <button
                        className="folder-open"
                        onClick={() => {
                          setFolderId(f.id);
                          setQuery("");
                        }}
                      >
                        <Folder size={48} strokeWidth={1.2} />
                        <strong>{f.name}</strong>
                        <small>
                          {
                            files.filter(
                              (d) =>
                                d.folder_id === f.id && d.status === "ready",
                            ).length
                          }{" "}
                          file · {date(f.created_at)}
                        </small>
                      </button>
                      {actions(f)}
                    </div>
                  ))}
                  {shownFiles.map((f) => (
                    <div className="folder-card" key={f.id}>
                      <button
                        className="folder-open"
                        onClick={() => void openFile(f)}
                      >
                        <FileText size={44} strokeWidth={1.2} />
                        <strong>{f.name}</strong>
                        <small>
                          {bytes(f.size)} · {date(f.created_at)}
                        </small>
                      </button>
                      {actions(f)}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {!!shownFolders.length && (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Folder</th>
                            <th>Dibuat</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shownFolders.map((f) => (
                            <tr key={f.id}>
                              <td>
                                <button
                                  className="text-button"
                                  onClick={() => {
                                    setFolderId(f.id);
                                    setQuery("");
                                  }}
                                >
                                  <Folder size={20} />
                                  {f.name}
                                </button>
                              </td>
                              <td>{date(f.created_at)}</td>
                              <td>{actions(f)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {fileTable(shownFiles)}
                </>
              )}
              {view === "grid" &&
                !shownFolders.length &&
                !shownFiles.length && (
                  <div className="empty">
                    <FolderOpen size={43} strokeWidth={1} />
                    <h3>
                      {query
                        ? "Tidak ada hasil pencarian"
                        : "Folder ini masih kosong"}
                    </h3>
                    <p>
                      {query
                        ? "Coba nama atau jenis file lainnya."
                        : writable
                          ? "Buat subfolder atau unggah dokumen pertama Anda."
                          : "Dokumen akan tampil saat ditambahkan oleh pengelola ruang."}
                    </p>
                  </div>
                )}
              {files.some(
                (f) => f.space_id === spaceId && f.status === "pending",
              ) && (
                <p className="note">
                  Ada unggahan belum selesai. Metadata menunggu rekonsiliasi;
                  dokumen tersebut belum masuk arsip.
                </p>
              )}
            </>
          )}
          {["users", "units", "periods"].includes(page) &&
            profile.role === "superadmin" && (
              <Admin
                now={clock}
                key={page}
                section={page}
                profiles={profiles}
                units={units}
                periods={periods}
                reload={reload}
                report={report}
              />
            )}
          {page === "profile" && (
            <section className="profile-panel">
              <span className="avatar large">
                <User size={30} />
              </span>
              <h1>{profile.full_name}</h1>
              <p className="muted">{session.user.email}</p>
              <dl>
                <dt>Peran</dt>
                <dd>{roles[profile.role]}</dd>
                <dt>Unit</dt>
                <dd>
                  {units.find((u) => u.id === profile.unit_id)?.name ||
                    "Sekolah"}
                </dd>
                <dt>Tampilan</dt>
                <dd>
                  {theme === "dark" ? "Gelap" : "Terang"} {themeButton}
                </dd>
              </dl>
              <p className="note">
                Perubahan identitas, peran, dan unit dikelola superadmin.
              </p>
              <button onClick={() => void db.auth.signOut()}>
                <LogOut size={17} />
                Keluar dari akun
              </button>
            </section>
          )}
        </main>
        <footer>
          TPMPS <span>Dokumen internal · Asia/Jakarta</span>
        </footer>
      </div>
      {action && (
        <Modal
          title={
            {
              folder: "Buat folder baru",
              upload: "Unggah dokumen",
              rename: "Ubah nama",
              move: "Pindahkan",
              delete: "Hapus dokumen",
              preview: "Preview dokumen",
            }[action.kind]
          }
          close={() => setAction(null)}
        >
          {action.kind === "upload" ? (
            <Upload spaceId={spaceId} folderId={folderId!} done={reload} />
          ) : action.kind === "preview" ? (
            <>
              <p className="preview-name">{action.target?.name}</p>
              {safePreview((action.target as Doc).mime_type) ? (
                (action.target as Doc).mime_type === "application/pdf" ? (
                  <iframe
                    title={action.target!.name}
                    src={action.url}
                    sandbox=""
                    className="preview-frame"
                  />
                ) : (
                  <img
                    className="preview-image"
                    src={action.url}
                    alt={action.target!.name}
                  />
                )
              ) : (
                <div className="empty">
                  <FileText size={40} />
                  <p>Preview tidak tersedia untuk jenis file ini.</p>
                  <small>File HTML, SVG, dan script tidak dijalankan.</small>
                </div>
              )}
              <p className="muted">
                {bytes((action.target as Doc).size)} ·{" "}
                {date(action.target!.created_at)}
              </p>
              <button
                className="primary"
                onClick={() => void openFile(action.target as Doc, true)}
              >
                <Download size={17} />
                Download
              </button>
            </>
          ) : (
            <form onSubmit={mutate}>
              {["folder", "rename"].includes(action.kind) && (
                <label>
                  Nama
                  <input
                    name="name"
                    defaultValue={action.target?.name || ""}
                    maxLength={255}
                    autoFocus
                    required
                  />
                </label>
              )}
              {action.kind === "move" && (
                <label>
                  Folder tujuan
                  <select
                    name="destination"
                    required={!!action.target && "object_key" in action.target}
                  >
                    {action.target && !("object_key" in action.target) && (
                      <option value="">Folder utama</option>
                    )}
                    {spaceFolders
                      .filter((f) => f.id !== action.target?.id)
                      .map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                  </select>
                  <small>
                    Pemindahan hanya dalam ruang dan periode yang sama. Siklus
                    folder ditolak server.
                  </small>
                </label>
              )}
              {action.kind === "delete" && (
                <p>
                  Hapus <strong>{action.target?.name}</strong> secara permanen?
                  Tidak ada fitur pemulihan. Folder berisi tidak dapat dihapus;
                  kosongkan isinya terlebih dahulu.
                </p>
              )}
              <div className="modal-footer">
                <button type="button" onClick={() => setAction(null)}>
                  Batal
                </button>
                <button
                  className={action.kind === "delete" ? "danger" : "primary"}
                  disabled={busy}
                >
                  {busy
                    ? "Memproses…"
                    : action.kind === "delete"
                      ? "Hapus permanen"
                      : "Simpan"}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
