import React, { useEffect, useState, useRef } from "react";
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
  ChevronDown,
  Filter,
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
  Award,
  TrendingUp,
  CheckCircle2,
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
import { LandingPage } from "./landing/LandingPage";
import { SelectDropdown } from "./SelectDropdown";
import "./styles.css";
import "./reference-layout.css";

const DEMO_ACCOUNTS = [
  // Pimpinan & Validator Mutu
  {
    badge: "1. KASEK",
    name: "Kurniawan Basuki, S.Pd., M.T.",
    roleTitle: "Kepala Sekolah",
    email: "kurniawan.basuki@smkn2magelang.sch.id",
    isLeader: true,
  },
  {
    badge: "7. UNIT TPMPS",
    name: "Vickky Listyaningsih, M.Kom.",
    roleTitle: "Ketua TPMPS",
    email: "vickky.listyaningsih@smkn2magelang.sch.id",
    isLeader: true,
  },
  {
    badge: "SUPER ADMIN",
    name: "Administrator SINTESA",
    roleTitle: "Admin Pusat",
    email: "admin@smkn2magelang.sch.id",
    isLeader: true,
  },
  // 16 Unit Pelaksana
  {
    badge: "2. UNIT KERJA WKS 1",
    name: "Yuana Dwi Utami, S.Pd.",
    roleTitle: "WKS 1 (Kurikulum)",
    email: "yuana.dwi.utami@smkn2magelang.sch.id",
  },
  {
    badge: "3. UNIT KERJA WKS 2",
    name: "Drs. Agus Supriyanto",
    roleTitle: "WKS 2 (Kesiswaan)",
    email: "agus.supriyanto@smkn2magelang.sch.id",
  },
  {
    badge: "4. UNIT KERJA WKS 3",
    name: "May Wilasih, S.Pd.",
    roleTitle: "WKS 3 (Sarpras)",
    email: "may.wilasih@smkn2magelang.sch.id",
  },
  {
    badge: "5. UNIT KERJA WKS 4",
    name: "Antuk Madiyanto, S.Pd.",
    roleTitle: "WKS 4 (Humas & Hubin)",
    email: "antuk.madiyanto@smkn2magelang.sch.id",
  },
  {
    badge: "6. UNIT KEJURUAN PPLG",
    name: "Arifin Andi Gunawan, S.Kom.",
    roleTitle: "Kaproli PPLG",
    email: "arifin.andi.gunawan@smkn2magelang.sch.id",
  },
  {
    badge: "7. UNIT KEJURUAN AKL",
    name: "Cicilia Nugrahanti, S.Pd.",
    roleTitle: "Kaproli AKL",
    email: "cicilia.nugrahanti@smkn2magelang.sch.id",
  },
  {
    badge: "8. UNIT KEJURUAN MPLB",
    name: "Purwaningsri, S.Pd., M.M.",
    roleTitle: "Kaproli MPLB",
    email: "purwaningsri@smkn2magelang.sch.id",
  },
  {
    badge: "9. UNIT KEJURUAN PM",
    name: "Fieka Praditaliana, S.Pd.",
    roleTitle: "Kaproli PM",
    email: "fieka.praditaliana@smkn2magelang.sch.id",
  },
  {
    badge: "10. UNIT KERJA RENBANG",
    name: "Dra. Gigih Murniati",
    roleTitle: "Ka. Renbang",
    email: "gigih.murniati@smkn2magelang.sch.id",
  },
  {
    badge: "11. UNIT KERJA TU",
    name: "Murtiningsih, S.Pd., M.Pd.",
    roleTitle: "Ka. Tata Usaha",
    email: "murtiningsih@smkn2magelang.sch.id",
  },
  {
    badge: "12. UNIT KERJA PERPUSTAKAAN",
    name: "Dra. Wiwik Pristiwati",
    roleTitle: "Ka. Perpustakaan",
    email: "wiwik.pristiwati@smkn2magelang.sch.id",
  },
  {
    badge: "13. UNIT KERJA BKK",
    name: "Anggraini Kusumawardani, S.Pd.",
    roleTitle: "Ka. BKK",
    email: "anggraini.kusumawardani@smkn2magelang.sch.id",
  },
  {
    badge: "14. UNIT KERJA BK",
    name: "Esti Zunastiti, S.Pd.",
    roleTitle: "Ka. Bimbingan Konseling",
    email: "esti.zunastiti@smkn2magelang.sch.id",
  },
  {
    badge: "15. UNIT KERJA LAB",
    name: "Yunus Adi Wibowo, S.Kom.",
    roleTitle: "Ka. Laboratorium",
    email: "yunus.adi.wibowo@smkn2magelang.sch.id",
  },
  {
    badge: "16. UNIT KERJA UMUM",
    name: "Mugi Rahayu, S.Pd., M.Pd.",
    roleTitle: "Ka. Bagian Umum",
    email: "mugi.rahayu@smkn2magelang.sch.id",
  },
  {
    badge: "17. UNIT KERJA USMAN",
    name: "Tri Djoko, S.Pd.",
    roleTitle: "Ka. Unit Usaha Mandiri",
    email: "tri.djoko@smkn2magelang.sch.id",
  },
];
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
  const [loginTab, setLoginTab] = useState<"quick" | "manual">("manual");
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
    [profileOpen, setProfileOpen] = useState(false),
    [moveDest, setMoveDest] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

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

  async function quickLogin(email: string) {
    setBusy(true);
    setError("");
    try {
      const { error } = await db.auth.signInWithPassword({
        email,
        password: "Sintesa2026!",
      });
      if (error) throw error;
    } catch {
      setError("Login gagal. Periksa koneksi Supabase.");
    } finally {
      setBusy(false);
    }
  }
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
  if (!session) {
    if (currentPath !== "/login" && !currentPath.startsWith("/login")) {
      return (
        <LandingPage
          theme={theme as "dark" | "light"}
          onToggleTheme={toggleTheme}
          onNavigateLogin={() => {
            window.history.pushState({}, "", "/login");
            setCurrentPath("/login");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      );
    }
    return (
      <div className="sintesa-login-page">
        <div className="login-top">
          <div className="brand">
            <img src="/school-logo.png" alt="Logo SMK Negeri 2 Magelang" />
            <span>
              SINTESA <span className="brand-sub">TPMPS · SMKN 2 Magelang</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              className="icon-button"
              style={{ width: "auto", padding: "0 14px", fontSize: 13, height: 36 }}
              onClick={() => {
                window.history.pushState({}, "", "/");
                setCurrentPath("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ← Beranda SINTESA
            </button>
            {themeButton}
          </div>
        </div>

        <div className="sintesa-login-wrap">
          <div className="sintesa-login-card-main">
            <div className="sintesa-header-box">
              <div className="sintesa-logo-circle">
                <img src="/school-logo.png" alt="Logo SMK Negeri 2 Magelang" />
              </div>
              <h1 className="sintesa-title-h1">
                SINTESA <span className="tpmps-blue">TPMPS</span>
              </h1>
              <h2 className="sintesa-subtitle-p" style={{ fontSize: "1.05rem", fontWeight: 700, margin: "4px 0 0" }}>
                Sistem Informasi TPMPS
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                Sistem Penjaminan Mutu Internal · SMKN 2 Magelang
              </p>
              <span className="sintesa-motto-tag">SMK NEGERI 2 MAGELANG • SWADAYA BHINA RAHARJA</span>
            </div>

            <div className="sintesa-tabs-nav">
              <button
                type="button"
                className={`sintesa-tab-btn ${loginTab === "manual" ? "is-active" : ""}`}
                onClick={() => setLoginTab("manual")}
              >
                Login Manual (Email & Password)
              </button>
              <button
                type="button"
                className={`sintesa-tab-btn ${loginTab === "quick" ? "is-active" : ""}`}
                onClick={() => setLoginTab("quick")}
              >
                Pilih Login Per Unit (1-Klik Cepat)
              </button>
            </div>

            {error && (
              <div className="error" role="alert" style={{ marginBottom: 20 }}>
                {error}
              </div>
            )}

            {loginTab === "quick" ? (
              <div>
                <div className="sintesa-section-title">
                  <ShieldCheck size={16} />
                  <span>AKUN PIMPINAN & VALIDATOR MUTU</span>
                </div>
                <div className="sintesa-demo-grid">
                  {DEMO_ACCOUNTS.filter((a) => a.isLeader).map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      className="sintesa-demo-card is-leader"
                      disabled={busy}
                      onClick={() => void quickLogin(acc.email)}
                    >
                      <div className="sintesa-demo-badge">
                        <span>{acc.badge}</span>
                        <ChevronRight size={14} />
                      </div>
                      <div className="sintesa-demo-name">{acc.name}</div>
                      <div className="sintesa-demo-role">{acc.roleTitle}</div>
                      <div className="sintesa-demo-email">{acc.email}</div>
                    </button>
                  ))}
                </div>

                <div className="sintesa-section-title">
                  <Building2 size={16} />
                  <span>AKUN UNIT KERJA PELAKSANA (16 UNIT)</span>
                </div>
                <div className="sintesa-demo-grid">
                  {DEMO_ACCOUNTS.filter((a) => !a.isLeader).map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      className="sintesa-demo-card"
                      disabled={busy}
                      onClick={() => void quickLogin(acc.email)}
                    >
                      <div className="sintesa-demo-badge">
                        <span>{acc.badge}</span>
                        <ChevronRight size={14} />
                      </div>
                      <div className="sintesa-demo-name">{acc.name}</div>
                      <div className="sintesa-demo-role">{acc.roleTitle}</div>
                      <div className="sintesa-demo-email">{acc.email}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={login} style={{ maxWidth: 440, margin: "0 auto" }}>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="nama@smkn2magelang.sch.id"
                    autoComplete="username"
                    required
                  />
                </label>
                <label>
                  Kata sandi
                  <input
                    type="password"
                    name="password"
                    placeholder="Sintesa2026!"
                    autoComplete="current-password"
                    required
                  />
                </label>
                <button
                  className="primary login-submit"
                  disabled={busy || !configured}
                  style={{ width: "100%", height: 44, marginTop: 12 }}
                >
                  {busy ? "Memverifikasi akun…" : "Masuk"}
                </button>

                <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                    Akses Cepat 1-Klik Akun Pimpinan:
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                    <button
                      type="button"
                      className="sintesa-demo-card is-leader"
                      style={{ padding: "8px 12px", textAlign: "left" }}
                      disabled={busy}
                      onClick={() => void quickLogin("superadmin@smkn2magelang.sch.id")}
                    >
                      <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text)" }}>👑 Superadmin</div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>Pengaturan Pusat</div>
                    </button>
                    <button
                      type="button"
                      className="sintesa-demo-card is-leader"
                      style={{ padding: "8px 12px", textAlign: "left" }}
                      disabled={busy}
                      onClick={() => void quickLogin("kepala.sekolah@smkn2magelang.sch.id")}
                    >
                      <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text)" }}>🎓 Kepala Sekolah</div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>Executive Monitoring</div>
                    </button>
                    <button
                      type="button"
                      className="sintesa-demo-card is-leader"
                      style={{ padding: "8px 12px", textAlign: "left" }}
                      disabled={busy}
                      onClick={() => void quickLogin("ketua.tpmps@smkn2magelang.sch.id")}
                    >
                      <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text)" }}>📋 Ketua TPMPS</div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>Audit Mutu & RTL</div>
                    </button>
                    <button
                      type="button"
                      className="sintesa-demo-card"
                      style={{ padding: "8px 12px", textAlign: "left" }}
                      disabled={busy}
                      onClick={() => void quickLogin("kurikulum@smkn2magelang.sch.id")}
                    >
                      <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text)" }}>🏫 Waka Kurikulum</div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>Standar Isi & Proses</div>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="sintesa-tab-btn"
                    style={{ width: "100%", marginTop: 12, padding: "10px", fontSize: 12, textAlign: "center", justifyContent: "center" }}
                    onClick={() => setLoginTab("quick")}
                  >
                    Buka Semua 19 Akun Unit Lengkap →
                  </button>
                </div>
              </form>
            )}

            <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "var(--muted)" }}>
              Dilindungi oleh Supabase PostgreSQL RLS & Audit Logging Mutu SMK Negeri 2 Magelang
            </div>
          </div>
        </div>

        <footer>
          SINTESA TPMPS · SMK Negeri 2 Magelang <span>Swadaya Bhina Raharja · Penjaminan Mutu Internal</span>
        </footer>
      </div>
    );
  }
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
          <img src="/school-logo.png" alt="Logo SMK Negeri 2 Magelang" />
          <span>
            SINTESA <span className="brand-sub">TPMPS · SMKN 2 Magelang</span>
          </span>
          <button
            className="mobile-close"
            aria-label="Tutup menu"
            onClick={() => setDrawer(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="nav-label">NAVIGASI SISTEM</div>
        <nav>
          <button
            className={page === "dashboard" ? "selected" : ""}
            onClick={() => navigate("dashboard")}
          >
            <LayoutDashboard />
            Dashboard Mutu
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
              Dokumen Seluruh Unit
            </button>
          )}
        </nav>
        <div className="nav-label">GOOGLE DRIVE UNIT</div>
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
            <div className="nav-label">ADMINISTRASI PUSAT</div>
            <nav>
              {[
                ["users", "Kelola Pengguna", Users],
                ["units", "Master Unit Kerja", Building2],
                ["periods", "Periode Penjaminan", CalendarDays],
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
          <strong>Penyimpanan Arsip Mutu</strong>
          <p>
            {bytes(periodFiles.reduce((sum, f) => sum + f.size, 0))} ·{" "}
            {periodFiles.length} berkas terverifikasi
          </p>
          <span>Bucket privat · RLS PostgreSQL Aktif</span>
        </div>
        <button className="logout" onClick={() => void db.auth.signOut()}>
          <LogOut size={18} />
          Keluar dari Sesi
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
              placeholder="Cari indikator, unit kerja, kode SNP, atau dokumen…"
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
        <main className={`page-${page}`}>
          <div className="context-row">
            <span>
              SINTESA <ChevronRight size={13} />{" "}
              {page === "dashboard"
                ? "Dashboard Mutu"
                : page === "files"
                  ? "Google Drive Unit"
                  : page === "spaces"
                    ? "Seluruh Unit"
                    : page === "profile"
                      ? "Profil Pengguna"
                      : "Administrasi Sistem"}
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
              Periode selesai — arsip terkunci hanya baca
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
              {/* SINTESA Dynamic Executive Welcome Banner */}
              <div className="sintesa-welcome-banner">
                <div className="sintesa-welcome-content">
                  <div className="sintesa-welcome-tags" style={{ marginBottom: 8 }}>
                    <span className="sintesa-tag tag-blue">
                      <Award size={13} />
                      {roles[profile.role]}
                    </span>
                    <span className="sintesa-tag tag-orange">
                      <CheckCircle2 size={13} />
                      Siklus PPEPP Aktif
                    </span>
                  </div>
                  <h1 style={{ fontSize: "1.65rem", fontWeight: 800, margin: "0 0 4px" }}>Dashboard</h1>
                  <p className="sintesa-welcome-subtitle" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text)", margin: "0 0 6px" }}>
                    Selamat datang kembali, {profile.full_name}
                  </p>
                  <p>
                    Capaian 8 Standar Nasional Pendidikan (SNP) sekolah saat ini rata-rata <strong>87.2%</strong>. Terdapat 2 program RTL yang sedang berjalan untuk akreditasi BAN-PDM.
                  </p>
                  <div className="sintesa-welcome-tags">
                    <span className="sintesa-tag">
                      <CalendarDays size={13} />
                      {period?.name || "Semester Aktif 2026/2027"}
                    </span>
                    <span className="sintesa-tag">
                      <Building2 size={13} />
                      SMK Negeri 2 Magelang
                    </span>
                  </div>
                </div>
                <div className="sintesa-welcome-actions">
                  <button
                    className="primary"
                    onClick={() => navigate("files")}
                  >
                    <FolderOpen size={17} />
                    Google Drive Unit
                  </button>
                  {writable && (
                    <button
                      onClick={() => setAction({ kind: "upload" })}
                    >
                      <UploadCloud size={17} />
                      Unggah Dokumen
                    </button>
                  )}
                  <button
                    onClick={() => void reload()}
                    aria-label="Segarkan data"
                  >
                    <RefreshCw size={17} />
                    Segarkan
                  </button>
                </div>
              </div>

              {/* 4 SINTESA Metric Cards Grid */}
              <div className="stats">
                <div className="stat">
                  <span className="stat-icon" style={{ background: "rgba(1, 110, 196, 0.1)", color: "#016ec4" }}>
                    <Award size={23} />
                  </span>
                  <span>
                    Total Standar SNP
                    <strong>8 Standar</strong>
                    <small style={{ color: "#10b981", display: "block", fontSize: 10, marginTop: 2 }}>
                      100% Terpetakan
                    </small>
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                    <Files size={23} />
                  </span>
                  <span>
                    Dokumen Mutu
                    <strong>{periodFiles.length} Berkas</strong>
                    <small style={{ color: "var(--muted)", display: "block", fontSize: 10, marginTop: 2 }}>
                      Bukti Fisik Sahih
                    </small>
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-icon" style={{ background: "rgba(252, 166, 1, 0.1)", color: "#d97706" }}>
                    <Building2 size={23} />
                  </span>
                  <span>
                    Unit Kerja Terdaftar
                    <strong>{units.length} Unit</strong>
                    <small style={{ color: "#016ec4", display: "block", fontSize: 10, marginTop: 2 }}>
                      Terintegrasi Lengkap
                    </small>
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-icon" style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}>
                    <TrendingUp size={23} />
                  </span>
                  <span>
                    RTL Mutu Aktif
                    <strong>2 Program</strong>
                    <small style={{ color: "#d97706", display: "block", fontSize: 10, marginTop: 2 }}>
                      Prioritas Tinggi
                    </small>
                  </span>
                </div>
              </div>

              {/* SINTESA Analytics Visual Grid */}
              <div className="sintesa-analytics-grid">
                {/* Left: Tren Capaian Mutu 8 SNP */}
                <div className="sintesa-chart-card">
                  <div className="sintesa-chart-header">
                    <div>
                      <h3>Tren Capaian Mutu 8 SNP</h3>
                      <p>Progres akumulasi capaian mutu sekolah dibandingkan target akreditasi</p>
                    </div>
                    <span className="sintesa-tag tag-blue" style={{ fontSize: 11 }}>
                      Semester Ganjil 2026/2027
                    </span>
                  </div>
                  <div className="sintesa-chart-body">
                    <svg viewBox="0 0 500 160" width="100%" height="150" style={{ overflow: "visible" }}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#016ec4" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#016ec4" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="480" y2="20" stroke="var(--border)" strokeDasharray="3 3" />
                      <line x1="40" y1="60" x2="480" y2="60" stroke="var(--border)" strokeDasharray="3 3" />
                      <line x1="40" y1="100" x2="480" y2="100" stroke="var(--border)" strokeDasharray="3 3" />
                      <line x1="40" y1="130" x2="480" y2="130" stroke="var(--border)" />
                      {/* Labels Y */}
                      <text x="10" y="24" fontSize="9" fill="var(--muted)">100%</text>
                      <text x="15" y="64" fontSize="9" fill="var(--muted)">90%</text>
                      <text x="15" y="104" fontSize="9" fill="var(--muted)">80%</text>
                      <text x="15" y="134" fontSize="9" fill="var(--muted)">70%</text>
                      {/* Target Akreditasi Line (95%) */}
                      <line x1="40" y1="40" x2="480" y2="40" stroke="#fca601" strokeWidth="1.5" strokeDasharray="4 4" />
                      <text x="410" y="36" fontSize="8" fill="#fca601" fontWeight="bold">Target A (95%)</text>
                      {/* Area Fill */}
                      <path
                        d="M 60 110 Q 140 100 220 80 T 380 68 T 460 52 L 460 130 L 60 130 Z"
                        fill="url(#areaGradient)"
                      />
                      {/* Spline Path */}
                      <path
                        d="M 60 110 Q 140 100 220 80 T 380 68 T 460 52"
                        fill="none"
                        stroke="#016ec4"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Data Points */}
                      {[
                        { cx: 60, cy: 110, m: "Jul", val: "78%" },
                        { cx: 140, cy: 102, m: "Agu", val: "81%" },
                        { cx: 220, cy: 80, m: "Sep", val: "85%" },
                        { cx: 300, cy: 84, m: "Okt", val: "84%" },
                        { cx: 380, cy: 68, m: "Nov", val: "87%" },
                        { cx: 460, cy: 52, m: "Des", val: "91%" },
                      ].map((pt) => (
                        <g key={pt.m}>
                          <circle cx={pt.cx} cy={pt.cy} r="4.5" fill="#ffffff" stroke="#016ec4" strokeWidth="2.5" />
                          <text x={pt.cx} y="145" fontSize="10" textAnchor="middle" fill="var(--muted)">
                            {pt.m}
                          </text>
                          <text x={pt.cx} y={pt.cy - 10} fontSize="9" textAnchor="middle" fill="#016ec4" fontWeight="600">
                            {pt.val}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                  <div className="sintesa-chart-footer">
                    <div className="sintesa-stat-box">
                      <span>Rata-Rata Mutu</span>
                      <strong>87.2%</strong>
                    </div>
                    <div className="sintesa-stat-box">
                      <span>Target Akreditasi</span>
                      <strong style={{ color: "#d97706" }}>95.0%</strong>
                    </div>
                    <div className="sintesa-stat-box">
                      <span>Tren Pertumbuhan</span>
                      <strong style={{ color: "#10b981" }}>+3.8%</strong>
                    </div>
                  </div>
                </div>

                {/* Right: Distribusi Predikat Mutu */}
                <div className="sintesa-chart-card">
                  <div className="sintesa-chart-header">
                    <div>
                      <h3>Distribusi Predikat Mutu</h3>
                      <p>Analisis sebaran mutu 16 unit kerja SMK Negeri 2 Magelang</p>
                    </div>
                  </div>
                  <div className="sintesa-chart-body" style={{ flexDirection: "column" }}>
                    <div style={{ position: "relative", width: 140, height: 140 }}>
                      <svg viewBox="0 0 100 100" width="140" height="140">
                        {/* Circle Donut Segments */}
                        <circle cx="50" cy="50" r="38" fill="none" stroke="var(--control)" strokeWidth="14" />
                        {/* Unggul: 44% (dash: 105, gap: 134) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#016ec4"
                          strokeWidth="14"
                          strokeDasharray="105 134"
                          strokeDashoffset="0"
                        />
                        {/* Baik: 39% (dash: 93, gap: 146) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#0284c7"
                          strokeWidth="14"
                          strokeDasharray="93 146"
                          strokeDashoffset="-105"
                        />
                        {/* Cukup: 11% (dash: 26, gap: 213) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#fca601"
                          strokeWidth="14"
                          strokeDasharray="26 213"
                          strokeDashoffset="-198"
                        />
                        {/* Perlu Perhatian: 6% (dash: 14, gap: 225) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="14"
                          strokeDasharray="14 225"
                          strokeDashoffset="-224"
                        />
                      </svg>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <strong style={{ fontSize: 20, color: "var(--text)" }}>16</strong>
                        <span style={{ fontSize: 9, color: "var(--muted)", textTransform: "uppercase" }}>
                          Unit Kerja
                        </span>
                      </div>
                    </div>

                    <div className="sintesa-donut-legend">
                      <div className="sintesa-legend-item">
                        <span>
                          <span className="sintesa-legend-color" style={{ background: "#016ec4" }} />
                          Unggul (A)
                        </span>
                        <strong>8 Unit (44%)</strong>
                      </div>
                      <div className="sintesa-legend-item">
                        <span>
                          <span className="sintesa-legend-color" style={{ background: "#0284c7" }} />
                          Baik (B)
                        </span>
                        <strong>7 Unit (39%)</strong>
                      </div>
                      <div className="sintesa-legend-item">
                        <span>
                          <span className="sintesa-legend-color" style={{ background: "#fca601" }} />
                          Cukup (C)
                        </span>
                        <strong>2 Unit (11%)</strong>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 10 }}>
                    Mayoritas unit kerja (83%) telah mencapai predikat Unggul & Baik.
                  </div>
                </div>
              </div>

              {!periodSpaces.length && (
                <div className="empty compact">
                  Belum ada ruang dokumen. Superadmin dapat menambahkan periode dan unit.
                </div>
              )}
              <div className="section-heading small">
                <h2>Dokumen Terbaru</h2>
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
                <h2>Semua Berkas Terdaftar</h2>
                <span className="muted">Sesuai hak akses autoritatif Anda</span>
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
                <div
                  className="pending-reconcile-box"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 14px",
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: 8,
                    margin: "16px 0",
                    fontSize: 13,
                  }}
                >
                  <span>
                    Ada unggahan belum selesai. Metadata menunggu rekonsiliasi;
                    dokumen tersebut belum masuk arsip.
                  </span>
                  {writable && (
                    <button
                      type="button"
                      className="danger"
                      style={{
                        padding: "4px 10px",
                        fontSize: 12,
                        minHeight: "auto",
                        height: "auto",
                      }}
                      onClick={async () => {
                        await db
                          .from("files")
                          .delete()
                          .eq("space_id", spaceId)
                          .eq("status", "pending");
                        await reload();
                      }}
                    >
                      Bersihkan antrean
                    </button>
                  )}
                </div>
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
                currentUserId={profile.id}
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
