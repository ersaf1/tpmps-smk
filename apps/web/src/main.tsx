import React, { lazy, Suspense, useEffect, useState, useRef } from "react";
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
  ArrowUpDown,
  ArrowLeft,
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
  Eye,
  EyeOff,
  BookOpen,
  FileCheck,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { db, configured, allRows } from "./client";
import {
  roles,
  bytes,
  canWrite,
  periodStatus,
  type Profile,
  type Unit,
  type Period,
  type Space,
  type Folder as FolderRow,
  type Doc,
} from "./domain";
import { Admin } from "./Admin";
import { SelectDropdown } from "./SelectDropdown";
import { ChevronDown, Filter, Image } from "lucide-react";
import { Modal } from "./Modal";
const FileViewer = lazy(() => import("./FileViewer").then(module => ({ default: module.FileViewer })));
import { Upload } from "./Upload";
import { Thumbnail } from "./Thumbnail";
import { FileIcon } from "./FileIcon";
import { warmPreview } from './preview-loaders';
const LandingPage = lazy(() => import("./landing/LandingPage").then(module => ({ default: module.LandingPage })));
import "./styles.css";
import "./reference-layout.css";
import "./motion.css";
type Action = {
  kind: "folder" | "upload" | "rename" | "move" | "delete";
  target?: FolderRow | Doc;
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
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname,
  );
  useEffect(() => {
    const onPop = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
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
    [clock, setClock] = useState(new Date()),
    [showPassword, setShowPassword] = useState(false),
    [loginError, setLoginError] = useState(""),
    [loginBusy, setLoginBusy] = useState(false),
    [previewFile, setPreviewFile] = useState<Doc | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moveDest, setMoveDest] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sintesa-sidebar") === "collapsed");
  useEffect(() => {
    if (!profileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);
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
  async function reload(forcedUserId?: string, silent = false) {
    if (!silent) setLoading(true);
    setError("");
    try {
      const { data: user } = await db.auth.getUser();
      const targetUserId = forcedUserId || user.user?.id;
      if (!targetUserId) throw new Error("Sesi berakhir. Silakan login kembali.");
      const { data: p, error: pe } = await db
        .from("profiles")
        .select("*")
        .eq("id", targetUserId)
        .single();
      if (pe) throw pe;
      if (!p?.active) {
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
      if (currentSession.session?.user.id && currentSession.session.user.id !== p.id) return;
      setProfile(p);
      setClock(new Date(now.data));
      const sortedPeriods = ps.sort((a, b) => b.starts_on.localeCompare(a.starts_on));
      setPeriods(sortedPeriods);
      setUnits(us);
      setSpaces(ss);
      setFolders(fs);
      setFiles(ds);
      setProfiles(pr);
      const activePid = sortedPeriods[0]?.id || "";
      const chosenPid = sortedPeriods.some((x) => x.id === periodId) ? periodId : activePid;
      setPeriodId(chosenPid);

      const periodSpaceList = ss.filter((s) => s.period_id === chosenPid);
      let targetSpace = periodSpaceList.find((s) => s.unit_id === null);
      if (p.role === "kepala_unit" && p.unit_id) {
        targetSpace = periodSpaceList.find((s) => s.unit_id === p.unit_id) || targetSpace;
      }
      if (targetSpace) {
        setSpaceId((old) => (periodSpaceList.some((s) => s.id === old) ? old : targetSpace!.id));
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Gagal memuat data. Periksa koneksi dan migrasi database.",
      );
    } finally {
      if (!silent) setLoading(false);
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
    setSpaceId((old) => {
      const periodSpaceList = spaces.filter((s) => s.period_id === periodId);
      if (old && periodSpaceList.some((s) => s.id === old)) return old;
      let preferred = periodSpaceList.find((s) => s.unit_id === null);
      if (profile?.role === "kepala_unit" && profile.unit_id) {
        preferred = periodSpaceList.find((s) => s.unit_id === profile.unit_id) || preferred;
      }
      return preferred?.id || periodSpaceList[0]?.id || "";
    });
  }, [periodId, spaces, profile?.role, profile?.unit_id]);
  const period = periods.find((p) => p.id === periodId),
    space = spaces.find((s) => s.id === spaceId);
  const status = period ? periodStatus(period, clock) : "";
  const writable =
    !!profile &&
    canWrite(profile, space, period, clock) &&
    (!space?.unit_id || units.some((u) => u.id === space.unit_id && u.active));
  const periodSpaces = spaces.filter((s) => s.period_id === periodId);
  const tpmpsSpace = periodSpaces.find((s) => s.unit_id === null);
  const unitSpaces = periodSpaces.filter((s) => s.unit_id !== null);
  const tpmpsFolders = tpmpsSpace
    ? folders.filter((f) => f.space_id === tpmpsSpace.id && !f.parent_id)
    : [];
  const mmFolder = tpmpsFolders.find(
    (f) => f.name.includes("MM") || f.name.toLowerCase().includes("manual mutu"),
  );
  const pmFolder = tpmpsFolders.find(
    (f) => f.name.includes("PM") || f.name.toLowerCase().includes("prosedur mutu"),
  );
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
    setPreviewFile(null);
    setPage(next);
    setDrawer(false);
    setQuery("");
    document.querySelector(".main-shell")?.scrollTo({ top: 0, behavior: "instant" });
  }
  useEffect(() => {
    setPreviewFile(null);
  }, [session?.user.id]);
  useEffect(() => {
    if (!drawer) return;
    const sidebar = document.querySelector<HTMLElement>(".sidebar");
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebar?.querySelector<HTMLElement>("button")?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawer(false);
      if (event.key !== "Tab" || !sidebar) return;
      const controls = Array.from(sidebar.querySelectorAll<HTMLElement>("button, select, a[href]"))
        .filter(node => node.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [drawer]);
  function getFolderStats(fid: string) {
    const descendantFolderIds = new Set<string>();
    const queue = [fid];
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = folders.filter((f) => f.parent_id === currentId);
      for (const child of children) {
        if (!descendantFolderIds.has(child.id)) {
          descendantFolderIds.add(child.id);
          queue.push(child.id);
        }
      }
    }
    const directFolders = folders.filter((f) => f.parent_id === fid).length;
    const totalSubfolders = descendantFolderIds.size;
    const directFiles = files.filter(
      (d) => d.folder_id === fid && d.status === "ready",
    );
    const allNestedFiles = files.filter(
      (d) =>
        (d.folder_id === fid || descendantFolderIds.has(d.folder_id)) &&
        d.status === "ready",
    );
    const totalSizeBytes = allNestedFiles.reduce((acc, f) => acc + f.size, 0);

    return {
      directFolders,
      totalSubfolders,
      directFilesCount: directFiles.length,
      totalFilesCount: allNestedFiles.length,
      totalSizeBytes,
    };
  }
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginBusy(true);
    setLoginError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    try {
      const { data, error: signInErr } = await db.auth.signInWithPassword({
        email,
        password,
      });
      if (signInErr) throw signInErr;
      if (data.session) {
        setSession(data.session);
        await reload(data.session.user.id);
        window.history.pushState({}, "", "/");
        setCurrentPath("/");
      }
    } catch (err: any) {
      setLoginError(
        err?.message ||
          "Gagal masuk. Periksa email, kata sandi, dan koneksi Anda.",
      );
    } finally {
      setLoginBusy(false);
    }
  }
  async function openFile(file: Doc, download = false) {
    if (download) {
      try {
        setBusy(true);
        // Prioritaskan signed download URL langsung agar browser mengunduh secara native
        const { data: signed, error: signErr } = await db.storage
          .from("tpmps-documents")
          .createSignedUrl(file.object_key, 300, { download: file.name });
        if (!signErr && signed?.signedUrl) {
          const anchor = document.createElement("a");
          anchor.style.display = "none";
          anchor.href = signed.signedUrl;
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
          anchor.setAttribute("download", file.name);
          document.body.appendChild(anchor);
          anchor.click();
          setTimeout(() => {
            if (document.body.contains(anchor)) {
              document.body.removeChild(anchor);
            }
          }, 1000);
          return;
        }

        // Fallback: unduh blob jika createSignedUrl gagal
        const { data, error } = await db.storage
          .from("tpmps-documents")
          .download(file.object_key);
        if (error) throw error;
        const url = URL.createObjectURL(
          new Blob([data], {
            type: file.mime_type || "application/octet-stream",
          }),
        );
        const anchor = document.createElement("a");
        anchor.style.display = "none";
        anchor.href = url;
        anchor.setAttribute("download", file.name);
        document.body.appendChild(anchor);
        anchor.click();
        setTimeout(() => {
          if (document.body.contains(anchor)) {
            document.body.removeChild(anchor);
          }
          URL.revokeObjectURL(url);
        }, 60_000);
      } catch (e) {
        report(e instanceof Error ? e.message : "Gagal mengunduh berkas.");
      } finally {
        setBusy(false);
      }
      return;
    }

    warmPreview(file.name, file.mime_type);
    setPreviewFile(file);
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
        const deletedId = target!.id;
        if (table === "files") {
          result = await db.storage
            .from("tpmps-documents")
            .remove([(target as Doc).object_key]);
          if (!result.error && !result.data?.some(object => object.name === (target as Doc).object_key)) {
            throw new Error('File belum terhapus. Periksa izin dan status periode.');
          }
          setFiles(prev => prev.filter(f => f.id !== deletedId));
        } else {
          result = await db
            .from("folders")
            .delete()
            .eq("id", target!.id)
            .select()
            .single();
          if (result?.error) throw result.error;
          setFolders(prev => prev.filter(f => f.id !== deletedId));
        }
        setAction(null);
        report(table === "files" ? "Dokumen berhasil dihapus" : "Folder berhasil dihapus");
        void reload(undefined, true);
        return;
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
  if (!session) {
    if (currentPath !== "/login" && !currentPath.startsWith("/login")) {
      return (
        <Suspense fallback={<div className="loading-screen" role="status">Memuat SINTESA…</div>}><LandingPage
          theme={theme as "dark" | "light"}
          onToggleTheme={toggleTheme}
          onNavigateLogin={() => {
            window.history.pushState({}, "", "/login");
            setCurrentPath("/login");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        /></Suspense>
      );
    }
    return (
      <div className="login-page">
        <div className="login-top">
          <div className="brand">
            <img src="/school-logo.png" alt="Logo sekolah" />
            <span>
              SINTESA<span className="brand-sub">SMK Negeri 2 Magelang</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              className="icon-button"
              style={{ width: "auto", padding: "0 12px", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}
              onClick={() => {
                window.history.pushState({}, "", "/");
                setCurrentPath("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <ArrowLeft size={16} />
              Beranda SINTESA
            </button>
            {themeButton}
          </div>
        </div>
        <div className="login-layout">
          <section className="login-intro">
            <div className="eyebrow">SISTEM PENJAMINAN MUTU INTERNAL</div>
            <h1>
              SMK Negeri 2 Magelang
              <br />
              Portal Dokumen Mutu
            </h1>
            <p>
              Masuk untuk mengunggah, mencari, dan memeriksa dokumen mutu sekolah.
            </p>
            <div className="archive-art" aria-hidden="true">
              <div className="art-card">
                <Folder size={60} strokeWidth={1} />
                <div>
                  <strong>Dokumen SPMI</strong>
                  <span>Manual Mutu, Prosedur Mutu, Catatan Mutu, Petunjuk Kerja</span>
                </div>
                <ShieldCheck size={25} />
              </div>
              <div className="art-line" />
              <div className="art-mini">
                <span>
                  <LockKeyhole size={18} />
                  Akses Terverifikasi
                </span>
                <span>
                  <CalendarDays size={18} />
                  Arsip Berbasis Periode
                </span>
              </div>
            </div>
          </section>
          <section className="login-card">
            <span className="eyebrow">AKSES SINTESA</span>
            <h2>Masuk ke Sistem TPMPS</h2>
            <p className="muted">Gunakan email dan kata sandi akun sekolah.</p>
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
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
              {(!configured || loginError) && (
                <p className="error" role="alert">
                  {loginError ||
                    "Supabase belum dikonfigurasi. Lengkapi environment untuk login."}
                </p>
              )}
              <button
                className="primary login-submit"
                disabled={loginBusy || !configured}
              >
                {loginBusy ? "Memeriksa akun…" : "Masuk"}
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
  }
  if (!profile) {
    if (loading || !error) {
      return (
        <div className="loading-screen">
          <div className="loading-brand">
            <img
              src="/school-logo.png"
              alt="Logo sekolah"
              style={{
                width: 56,
                height: 56,
                objectFit: "contain",
                marginBottom: 16,
              }}
            />
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>
              Menyiapkan ruang dokumen mutu…
            </h2>
            <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              Memuat profil dan arsip periode aktif
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="loading-screen">
        <h2>Akun belum dapat digunakan</h2>
        <p className="error">{error}</p>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="primary" onClick={() => void reload()}>
            Coba lagi
          </button>
          <button onClick={() => void db.auth.signOut()}>Keluar</button>
        </div>
      </div>
    );
  }
  const actions = (target: FolderRow | Doc) => (
    <div className="row-actions">
      {"object_key" in target && (
        <button
          aria-label={`Unduh ${target.name}`}
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
    <div className="table-wrap" tabIndex={0} role="region" aria-label="Daftar dokumen">
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
                  onPointerEnter={() => warmPreview(file.name, file.mime_type)}
                  onFocus={() => warmPreview(file.name, file.mime_type)}
                  onClick={() => void openFile(file)}
                >
                  <span className="file-icon">
                    <FileIcon name={file.name} mime={file.mime_type} />
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
                    aria-label={`Unduh ${file.name}`}
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
    <div className={`app-shell${collapsed ? " sidebar-collapsed" : ""}`}>
      {drawer && (
        <button
          className="drawer-backdrop"
          aria-label="Tutup navigasi"
          onClick={() => setDrawer(false)}
        />
      )}
      <aside id="workspace-navigation" aria-label="Navigasi utama" className={drawer ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <img src="/school-logo.png" alt="Logo sekolah" />
          <span>
            SINTESA<span className="brand-sub">SMK Negeri 2 Magelang</span>
          </span>
          <button
            className="mobile-close"
            aria-label="Tutup menu"
            onClick={() => setDrawer(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="nav-label">RUANG KERJA</div>
        <nav>
          <button
            aria-label="Ringkasan TPMPS" title="Ringkasan TPMPS" className={page === "dashboard" ? "selected" : ""}
            onClick={() => navigate("dashboard")}
          >
            <LayoutDashboard />
            Ringkasan TPMPS
          </button>
          <button
            aria-label="Dokumen" title="Dokumen" className={page === "files" ? "selected" : ""}
            onClick={() => navigate("files")}
          >
            <FolderOpen />
            Dokumen
          </button>
          {profile.role !== "kepala_unit" && (
            <button
              aria-label="Dokumen seluruh unit" title="Dokumen seluruh unit" className={page === "spaces" ? "selected" : ""}
              onClick={() => navigate("spaces")}
            >
              <Building2 />
              Dokumen seluruh unit
            </button>
          )}
        </nav>
        {tpmpsSpace && (
          <>
            <div className="nav-label">PENJAMINAN MUTU (TPMPS)</div>
            <nav className="space-nav tpmps-nav">
              <button
                className={`tpmps-root-btn ${page === "files" && spaceId === tpmpsSpace.id && !folderId ? "space-selected" : ""}`}
                onClick={() => {
                  setSpaceId(tpmpsSpace.id);
                  setFolderId(null);
                  navigate("files");
                }}
              >
                <ShieldCheck size={18} className="tpmps-badge-icon" />
                <span>Dokumen Mutu Sekolah</span>
                <ChevronRight size={14} />
              </button>
              <div className="tpmps-subnav">
                {tpmpsFolders.map((f) => (
                  <button
                    key={f.id}
                    className={`subnav ${page === "files" && spaceId === tpmpsSpace.id && folderId === f.id ? "space-selected" : ""}`}
                    onClick={() => {
                      setSpaceId(tpmpsSpace.id);
                      setFolderId(f.id);
                      setQuery("");
                      navigate("files");
                    }}
                  >
                    <Folder size={14} />
                    <span>{f.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </>
        )}
        <div className="nav-label">RUANG UNIT KERJA ({unitSpaces.length})</div>
        <nav className="space-nav">
          {unitSpaces.map((s) => (
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
                <Building2 size={16} />
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
                  aria-label={String(label)} title={String(label)} className={page === id ? "selected" : ""}
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
          <button className="desktop-collapse icon-button" aria-label={collapsed ? "Perluas navigasi" : "Ringkas navigasi"} title={collapsed ? "Perluas navigasi" : "Ringkas navigasi"} aria-expanded={!collapsed} aria-controls="workspace-navigation" onClick={() => {
            setCollapsed(!collapsed);
            localStorage.setItem("sintesa-sidebar", collapsed ? "expanded" : "collapsed");
          }}><Menu size={20} /></button>
          <button
            className="mobile-menu"
            aria-label="Buka menu"
            aria-expanded={drawer}
            aria-controls="workspace-navigation"
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
            <div className="profile-menu-container" ref={profileRef}>
              <button
                className="profile-button"
                onClick={() => setProfileOpen((o) => !o)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="Menu akun pengguna"
              >
                <span className="avatar">
                  {profile.full_name
                    .split(" ")
                    .map((w) => w[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("") || "SMK"}
                </span>
                <span>
                  {profile.full_name}
                  <small>{roles[profile.role]}</small>
                </span>
                <ChevronDown
                  size={14}
                  className="profile-chevron-icon"
                  style={{
                    transform: profileOpen ? "rotate(180deg)" : "none",
                  }}
                />
              </button>
              {profileOpen && (
                <div className="profile-dropdown-menu">
                  <div className="profile-dropdown-header">
                    <strong>{profile.full_name}</strong>
                    <span>{session.user.email}</span>
                    <span className="profile-role-badge">{roles[profile.role]}</span>
                  </div>
                  <div className="profile-dropdown-divider" />
                  <button
                    className="profile-dropdown-item"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("profile");
                    }}
                  >
                    <User size={15} />
                    <span>Profil & Informasi Hak Akses</span>
                  </button>
                  <button
                    className="profile-dropdown-item"
                    onClick={() => {
                      setProfileOpen(false);
                      toggleTheme();
                    }}
                  >
                    {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                    <span>Ubah ke Tema {theme === "dark" ? "Terang" : "Gelap"}</span>
                  </button>
                  <div className="profile-dropdown-divider" />
                  <button
                    className="profile-dropdown-item is-danger"
                    onClick={() => {
                      setProfileOpen(false);
                      void db.auth.signOut();
                    }}
                  >
                    <LogOut size={15} />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main key={page} className={`page-${page}`}>
          <div className="context-row">
            <span>
              SINTESA <ChevronRight size={13} />{" "}
              {page === "dashboard"
                ? "Ringkasan TPMPS"
                : page === "files"
                  ? "Dokumen"
                  : page === "spaces"
                    ? "Seluruh unit"
                    : page === "profile"
                      ? "Profil"
                      : page === "preview"
                        ? "Pratinjau Dokumen"
                        : "Administrasi"}
            </span>
            <div className="period-picker">
              <SelectDropdown
                ariaLabel="Pilih periode"
                value={periodId}
                onChange={setPeriodId}
                leadingIcon={<CalendarDays size={15} />}
                placeholder="Pilih periode mutu..."
                buttonClassName="sintesa-period-btn"
                options={periods.map((p) => ({
                  value: p.id,
                  label: p.name,
                  badge: periodStatus(p, clock),
                  description: `${p.starts_on} s/d ${p.ends_on}`,
                }))}
                width="auto"
              />
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
              Periode selesai (arsip hanya baca)
            </div>
          )}
          {status === "Belum dimulai" && (
            <div className="archive-banner">
              <CalendarDays size={17} />
              Periode belum dimulai (dokumen hanya dapat dibaca)
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
                  <h1>Ringkasan TPMPS</h1>
                  <p className="muted">
                    Dokumen dan aktivitas penjaminan mutu pada periode terpilih.
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
              {tpmpsSpace && (
                <div className="tpmps-dashboard-section">
                  <div className="section-heading small" style={{ marginBottom: 12 }}>
                    <div>
                      <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <ShieldCheck size={20} color="#016ec4" />
                        Dokumen Mutu Sekolah (SPMI)
                      </h2>
                      <span className="muted">
                        Manual Mutu (MM) dan Prosedur Mutu (PM) untuk penjaminan mutu sekolah
                      </span>
                    </div>
                    {profile.role === "ketua_tpmps" ? (
                      <span className="badge active">
                        Ketua TPMPS · Kelola dokumen
                      </span>
                    ) : profile.role === "kepala_sekolah" ? (
                      <span className="badge" style={{ background: "rgba(252,166,1,0.15)", color: "var(--accent-text)" }}>
                        Akses kepala sekolah · Hanya lihat
                      </span>
                    ) : null}
                  </div>
                  <div className="mutu-cards-grid">
                    <div className="mutu-card">
                      <div className="mutu-card-header">
                        <div className="mutu-icon-box mm">
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <h3>MM: Manual Mutu</h3>
                          <span className="mutu-count">
                            {mmFolder
                              ? files.filter((f) => f.folder_id === mmFolder.id && f.status === "ready").length
                              : 0}{" "}
                            berkas dokumen
                          </span>
                        </div>
                      </div>
                      <p className="mutu-desc">
                        Pedoman dan kebijakan mutu utama standar implementasi SPMI di SMK Negeri 2 Magelang.
                      </p>
                      <div className="mutu-actions">
                        <button
                          className="btn-outline"
                          onClick={() => {
                            if (mmFolder && tpmpsSpace) {
                              setSpaceId(tpmpsSpace.id);
                              setFolderId(mmFolder.id);
                              navigate("files");
                            }
                          }}
                        >
                          <FolderOpen size={16} />
                          Buka Folder MM
                        </button>
                        {writable && tpmpsSpace && mmFolder && (
                          <button
                            className="primary btn-compact"
                            onClick={() => {
                              setSpaceId(tpmpsSpace.id);
                              setFolderId(mmFolder.id);
                              setAction({ kind: "upload" });
                            }}
                          >
                            <UploadCloud size={16} />
                            Unggah MM
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mutu-card">
                      <div className="mutu-card-header">
                        <div className="mutu-icon-box pm">
                          <FileCheck size={24} />
                        </div>
                        <div>
                          <h3>PM: Prosedur Mutu</h3>
                          <span className="mutu-count">
                            {pmFolder
                              ? files.filter((f) => f.folder_id === pmFolder.id && f.status === "ready").length
                              : 0}{" "}
                            berkas dokumen
                          </span>
                        </div>
                      </div>
                      <p className="mutu-desc">
                        Standar Operasional Prosedur (SOP) dan mekanisme penjaminan mutu antar unit kerja sekolah.
                      </p>
                      <div className="mutu-actions">
                        <button
                          className="btn-outline"
                          onClick={() => {
                            if (pmFolder && tpmpsSpace) {
                              setSpaceId(tpmpsSpace.id);
                              setFolderId(pmFolder.id);
                              navigate("files");
                            }
                          }}
                        >
                          <FolderOpen size={16} />
                          Buka Folder PM
                        </button>
                        {writable && tpmpsSpace && pmFolder && (
                          <button
                            className="primary btn-compact"
                            onClick={() => {
                              setSpaceId(tpmpsSpace.id);
                              setFolderId(pmFolder.id);
                              setAction({ kind: "upload" });
                            }}
                          >
                            <UploadCloud size={16} />
                            Unggah PM
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                    Daftar ruang dokumen unit kerja dan tim penjaminan mutu sekolah.
                  </p>
                </div>
              </div>
              <div className="folder-grid">
                {periodSpaces.map((s) => {
                  const sFiles = periodFiles.filter((f) => f.space_id === s.id);
                  const sFolders = folders.filter((f) => f.space_id === s.id);
                  const rootFolders = sFolders.filter((f) => !f.parent_id);
                  const totalSize = sFiles.reduce((acc, f) => acc + f.size, 0);
                  return (
                    <button
                      className="folder-card space-overview-card"
                      key={s.id}
                      title={`${s.name}\n• Folder: ${rootFolders.length} utama (${sFolders.length} total bertingkat)\n• Berkas file: ${sFiles.length} berkas\n• Total ukuran: ${bytes(totalSize)}`}
                      onClick={() => {
                        setSpaceId(s.id);
                        setFolderId(null);
                        navigate("files");
                      }}
                    >
                      <div className="space-card-icon">
                        {s.unit_id === null ? (
                          <ShieldCheck size={44} color="#016ec4" />
                        ) : (
                          <Building2 size={44} />
                        )}
                      </div>
                      <strong>{s.name}</strong>
                      <div className="folder-meta-badges">
                        <span className="folder-badge subfolders">
                          <Folder size={13} strokeWidth={2} />
                          <span>
                            {rootFolders.length} folder utama ({sFolders.length} total bertingkat)
                          </span>
                        </span>
                        <span className="folder-badge files">
                          <FileText size={13} strokeWidth={2} />
                          <span>{sFiles.length} berkas file</span>
                        </span>
                      </div>
                      <small className="space-footer">
                        Total {bytes(totalSize)}
                        <ChevronRight size={14} />
                      </small>
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {page === "files" && (
            <>
              <div className="section-heading">
                <div>
                  <h1>
                    {currentFolder?.name || space?.name || "Dokumen"}
                  </h1>
                  <p className="muted">
                    {currentFolder ? (
                      (() => {
                        const curStats = getFolderStats(currentFolder.id);
                        return (
                          <>
                            {shownFolders.length} subfolder langsung
                            {curStats.totalSubfolders > shownFolders.length
                              ? ` (${curStats.totalSubfolders} total bertingkat)`
                              : ""}
                            {" · "}
                            {shownFiles.length} berkas langsung
                            {curStats.totalFilesCount > shownFiles.length
                              ? ` (${curStats.totalFilesCount} total berkas bertingkat)`
                              : ""}
                            {curStats.totalSizeBytes > 0 ? ` · ${bytes(curStats.totalSizeBytes)}` : ""}
                            {!writable ? " · Hanya baca" : ""}
                          </>
                        );
                      })()
                    ) : (
                      <>
                        {shownFolders.length} folder utama
                        {folders.filter((f) => f.space_id === spaceId).length > shownFolders.length
                          ? ` (${folders.filter((f) => f.space_id === spaceId).length} total bertingkat)`
                          : ""}
                        {" · "}
                        {periodFiles.filter((f) => f.space_id === spaceId).length} berkas file (
                        {bytes(
                          periodFiles
                            .filter((f) => f.space_id === spaceId)
                            .reduce((s, f) => s + f.size, 0),
                        )}
                        )
                        {!writable ? " · Hanya baca" : ""}
                      </>
                    )}
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
                  <SelectDropdown
                    ariaLabel="Urutkan"
                    value={sort}
                    onChange={setSort}
                    leadingIcon={<ArrowUpDown size={14} />}
                    buttonClassName="sintesa-sort-btn"
                    width="auto"
                    options={[
                      { value: "date", label: "Terbaru", icon: <CalendarDays size={14} /> },
                      { value: "name", label: "Nama A–Z", icon: <ArrowUpDown size={14} /> },
                      { value: "size", label: "Ukuran Berkas", icon: <HardDrive size={14} /> },
                    ]}
                  />
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
                <SelectDropdown
                  ariaLabel="Filter jenis file"
                  value={type}
                  onChange={setType}
                  leadingIcon={<Filter size={14} />}
                  width="100%"
                  options={[
                    { value: "all", label: "Semua jenis file", icon: <Files size={14} /> },
                    { value: "pdf", label: "PDF Dokumen", icon: <FileText size={14} style={{ color: "#ef4444" }} /> },
                    { value: "image", label: "Gambar & Foto", icon: <Image size={14} style={{ color: "#10b981" }} /> },
                    { value: "other", label: "Dokumen lainnya", icon: <Folder size={14} style={{ color: "#fca601" }} /> },
                  ]}
                />
                {query && (
                  <span className="muted">Hasil pencarian dalam ruang ini</span>
                )}
              </div>
              {view === "grid" ? (
                <div className="folder-grid">
                  {shownFolders.map((f) => {
                    const stats = getFolderStats(f.id);
                    return (
                      <div className="folder-card" key={f.id}>
                        <button
                          className="folder-open"
                          title={`${f.name}\n• Subfolder: ${stats.directFolders} langsung (${stats.totalSubfolders} total di dalamnya)\n• Berkas file: ${stats.directFilesCount} langsung (${stats.totalFilesCount} total di semua subfolder)\n• Total ukuran: ${bytes(stats.totalSizeBytes)}`}
                          onClick={() => {
                            setFolderId(f.id);
                            setQuery("");
                          }}
                        >
                          <Folder size={48} strokeWidth={1.2} />
                          <strong>{f.name}</strong>
                          <div className="folder-meta-badges">
                            <span className="folder-badge subfolders">
                              <Folder size={13} strokeWidth={2} />
                              <span>
                                {stats.directFolders} subfolder
                                {stats.totalSubfolders > stats.directFolders
                                  ? ` (${stats.totalSubfolders} bertingkat)`
                                  : ""}
                              </span>
                            </span>
                            <span className="folder-badge files">
                              <FileText size={13} strokeWidth={2} />
                              <span>
                                {stats.directFilesCount === 0 && stats.totalFilesCount > 0
                                  ? `0 langsung (${stats.totalFilesCount} di subfolder)`
                                  : stats.totalFilesCount > stats.directFilesCount
                                  ? `${stats.directFilesCount} langsung (${stats.totalFilesCount} total)`
                                  : `${stats.totalFilesCount} berkas file`}
                              </span>
                            </span>
                          </div>
                          <small className="folder-date">
                            {stats.totalSizeBytes > 0 ? `${bytes(stats.totalSizeBytes)} · ` : ""}
                            Dibuat: {date(f.created_at)}
                          </small>
                        </button>
                        {actions(f)}
                      </div>
                    );
                  })}
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
                    <div className="table-wrap" tabIndex={0} role="region" aria-label="Daftar dokumen">
                      <table>
                        <thead>
                          <tr>
                            <th>Folder</th>
                            <th>Struktur Isi (Subfolder & File)</th>
                            <th>Total Ukuran</th>
                            <th>Dibuat</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shownFolders.map((f) => {
                            const stats = getFolderStats(f.id);
                            return (
                              <tr key={f.id}>
                                <td>
                                  <button
                                    className="text-button folder-title-btn"
                                    title={`${f.name}\n• Subfolder: ${stats.directFolders} langsung (${stats.totalSubfolders} total di dalamnya)\n• Berkas file: ${stats.directFilesCount} langsung (${stats.totalFilesCount} total di semua subfolder)\n• Total ukuran: ${bytes(stats.totalSizeBytes)}`}
                                    onClick={() => {
                                      setFolderId(f.id);
                                      setQuery("");
                                    }}
                                  >
                                    <Folder size={20} />
                                    <strong>{f.name}</strong>
                                  </button>
                                </td>
                                <td>
                                  <div className="folder-table-stats">
                                    <span className="stat-pill folder-pill">
                                      <Folder size={13} strokeWidth={2} />
                                      <span>
                                        {stats.directFolders} subfolder
                                        {stats.totalSubfolders > stats.directFolders
                                          ? ` (${stats.totalSubfolders} bertingkat)`
                                          : ""}
                                      </span>
                                    </span>
                                    <span className="stat-pill file-pill">
                                      <FileText size={13} strokeWidth={2} />
                                      <span>
                                        {stats.directFilesCount === 0 && stats.totalFilesCount > 0
                                          ? `0 langsung (${stats.totalFilesCount} di subfolder)`
                                          : stats.totalFilesCount > stats.directFilesCount
                                          ? `${stats.directFilesCount} langsung (${stats.totalFilesCount} total)`
                                          : `${stats.totalFilesCount} berkas file`}
                                      </span>
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  {stats.totalSizeBytes > 0 ? bytes(stats.totalSizeBytes) : "-"}
                                </td>
                                <td>{date(f.created_at)}</td>
                                <td>{actions(f)}</td>
                              </tr>
                            );
                          })}
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
                currentUserId={session.user.id}
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
      {previewFile && <Suspense fallback={<div className="preview-opening" role="status">Menyiapkan pratinjau…</div>}><FileViewer key={previewFile.id} file={previewFile} close={() => setPreviewFile(null)} download={() => void openFile(previewFile, true)} busy={busy} /></Suspense>}
      {action && (
        <Modal
          title={
            {
              folder: "Buat folder baru",
              upload: "Unggah dokumen",
              rename: "Ubah nama",
              move: "Pindahkan",
              delete: "Hapus dokumen",
            }[action.kind]
          }
          close={() => setAction(null)}
        >
          {action.kind === "upload" ? (
            <Upload
              spaceId={spaceId}
              folderId={folderId!}
              done={reload}
              onClose={() => setAction(null)}
              report={report}
            />
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
                  <SelectDropdown
                    name="destination"
                    ariaLabel="Folder tujuan"
                    value={moveDest}
                    onChange={setMoveDest}
                    leadingIcon={<Folder size={14} />}
                    required={!!action.target && "object_key" in action.target}
                    placeholder="Pilih folder tujuan..."
                    options={[
                      ...(action.target && !("object_key" in action.target)
                        ? [{ value: "", label: "Folder utama (Root)", icon: <Folder size={14} /> }]
                        : []),
                      ...spaceFolders
                        .filter((f) => f.id !== action.target?.id)
                        .map((f) => ({
                          value: f.id,
                          label: f.name,
                          icon: <FolderOpen size={14} />,
                        })),
                    ]}
                  />
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
