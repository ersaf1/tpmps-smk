import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, RefreshCw } from "lucide-react";
import { FileIcon } from "./FileIcon";
import { db, supabaseUrl, publicKey } from "./client";
import { MAX_BYTES, bytes } from "./domain";
type Item = {
  id: string;
  file: File;
  metadata?: string;
  key?: string;
  progress: number;
  state: "waiting" | "uploading" | "done" | "error";
  error?: string;
};
export function Upload({
  spaceId,
  folderId,
  done,
  onClose,
  report,
}: {
  spaceId: string;
  folderId: string;
  done: () => Promise<void>;
  onClose?: () => void;
  report?: (message: string) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const processing = useRef(false);
  const [drag, setDrag] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const update = (id: string, change: Partial<Item>) =>
    setItems((old) =>
      old.map((item) => (item.id === id ? { ...item, ...change } : item)),
    );
  async function send(item: Item) {
    update(item.id, { state: "uploading", error: undefined });
    try {
      if (item.file.size > MAX_BYTES)
        throw new Error("Maksimum 50 MB (50.000.000 byte)");
      let key = item.key;
      let metadata = item.metadata;
      if (!key) {
        const { data, error } = await db
          .from("files")
          .insert({
            space_id: spaceId,
            folder_id: folderId,
            name: item.file.name,
            size: item.file.size,
            mime_type: item.file.type || "application/octet-stream",
          })
          .select()
          .single();
        if (error) throw error;
        key = data.object_key;
        metadata = data.id;
        Object.assign(item, { key, metadata });
        update(item.id, { key, metadata });
      } else {
        const { data, error } = await db
          .from("files")
          .select("status")
          .eq("id", metadata!)
          .single();
        if (error) throw error;
        if (data.status === "ready") {
          update(item.id, { state: "done", progress: 100 });
          return;
        }
      }
      const { data } = await db.auth.getSession();
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `${supabaseUrl}/storage/v1/object/tpmps-documents/${key}`,
        );
        xhr.setRequestHeader("apikey", publicKey);
        xhr.setRequestHeader(
          "Authorization",
          `Bearer ${data.session?.access_token}`,
        );
        xhr.setRequestHeader(
          "Content-Type",
          item.file.type || "application/octet-stream",
        );
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            update(item.id, {
              progress: Math.round((e.loaded / e.total) * 95),
            });
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else
            reject(
              new Error(
                "Unggah ditolak. Periksa koneksi, izin, dan status periode.",
              ),
            );
        };
        xhr.onerror = () =>
          reject(new Error("Koneksi terputus. Coba lagi dengan aman."));
        xhr.timeout = 300000;
        xhr.ontimeout = () =>
          reject(new Error("Waktu unggah habis. Coba lagi."));
        xhr.send(item.file);
      });
      update(item.id, { state: "done", progress: 100 });
      return true;
    } catch (error) {
      update(item.id, {
        state: "error",
        error: error instanceof Error ? error.message : "Unggah gagal",
      });
      return false;
    }
  }
  async function add(files: FileList | null) {
    if (!files || processing.current) return;
    const fileArray = Array.from(files);
    const oversized = fileArray.find((f) => f.size > MAX_BYTES);
    if (oversized) {
      if (picker.current) picker.current.value = "";
      if (onClose) onClose();
      if (report) {
        report(
          `Ukuran file "${oversized.name}" melebihi batas 50 MB (${bytes(oversized.size)}). Unggah dibatalkan.`,
        );
      }
      return;
    }
    processing.current = true;
    const added: Item[] = fileArray.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      state: "waiting",
    }));
    setItems((old) => [...old, ...added]);
    let allOk = true;
    for (const item of added) {
      const ok = await send(item);
      if (!ok) allOk = false;
    }
    processing.current = false;
    await done();
    if (allOk && added.length > 0) {
      setTimeout(() => {
        if (onClose) onClose();
        if (report) report("Dokumen berhasil diunggah!");
      }, 500);
    }
  }
  return (
    <>
      <p className="muted">
        Simpan dokumen ke folder ini. Maksimum 50 MB per file.
      </p>
      <div
        className={`dropzone ${drag ? "drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void add(e.dataTransfer.files);
        }}
      >
        <UploadCloud size={44} />
        <h3>Tarik & lepas file di sini</h3>
        <p className="muted">atau pilih beberapa file dari perangkat Anda</p>
        <button
          className="primary"
          disabled={items.some((i) => i.state === "uploading")}
          onClick={() => picker.current?.click()}
        >
          Pilih file
        </button>
        <input
          hidden
          ref={picker}
          type="file"
          multiple
          onChange={(e) => void add(e.target.files)}
        />
      </div>
      <div className="upload-list">
        {items.map((item) => (
          <div key={item.id} className="upload-item">
            <FileIcon name={item.file.name} mime={item.file.type} size={24} />
            <div>
              <strong>{item.file.name}</strong>
              <small>
                {bytes(item.file.size)} ·{" "}
                {item.state === "done"
                  ? "Selesai"
                  : item.state === "error"
                    ? item.error
                    : item.state === "waiting"
                      ? "Menunggu"
                      : `Mengunggah ${item.progress}%`}
              </small>
              <progress max={100} value={item.progress} />
            </div>
            {item.state === "done" ? (
              <CheckCircle2 size={19} />
            ) : (
              item.state === "error" && (
                <button
                  aria-label={`Coba lagi ${item.file.name}`}
                  onClick={async () => {
                    if (processing.current) return;
                    processing.current = true;
                    await send(item);
                    processing.current = false;
                    await done();
                    if (item.state === "done") {
                      setTimeout(() => {
                        if (onClose) onClose();
                        if (report) report("Dokumen berhasil diunggah!");
                      }, 500);
                    }
                  }}
                >
                  <RefreshCw size={17} />
                </button>
              )
            )}
          </div>
        ))}
      </div>
      <p className="note">
        Jika periode berakhir saat unggah, server menolak penyimpanan. Jangan
        tutup dialog saat unggahan berjalan.
      </p>
    </>
  );
}
