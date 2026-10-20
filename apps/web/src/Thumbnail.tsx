import { useEffect, useRef, useState } from "react";
import { FileIcon } from "./FileIcon";
import { db } from "./client";
import { safePreview, type Doc } from "./domain";
export function Thumbnail({ file }: { file: Doc }) {
  const [url, setUrl] = useState("");
  const holder = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let disposed = false;
    let objectUrl = "";
    const controller = new AbortController();
    setUrl("");
    let started = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting) || started) return;
      started = true; observer.disconnect();
      if (file.mime_type.startsWith("image/") && safePreview(file.mime_type)) {
        void db.storage
          .from("tpmps-documents")
          .download(file.object_key, {}, { signal: controller.signal })
          .then(({ data }) => {
            if (data && !disposed) {
              objectUrl = URL.createObjectURL(new Blob([data], { type: file.mime_type }));
              setUrl(objectUrl);
            }
          }).catch(() => {});
      }
    }, { rootMargin: '150px' });
    if (holder.current) observer.observe(holder.current);
    return () => {
      disposed = true;
      observer.disconnect(); controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file.object_key, file.mime_type]);
  return <span ref={holder} className="thumbnail-holder">{url ? (
    <img className="document-thumbnail" src={url} alt="" loading="lazy" onError={() => setUrl('')} />
  ) : <FileIcon name={file.name} mime={file.mime_type} size={48} />}</span>;
}
