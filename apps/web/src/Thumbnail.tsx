import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { db } from "./client";
import { safePreview, type Doc } from "./domain";
export function Thumbnail({ file }: { file: Doc }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let disposed = false;
    let objectUrl = "";
    if (file.mime_type.startsWith("image/") && safePreview(file.mime_type)) {
      void db.storage
        .from("tpmps-documents")
        .download(file.object_key)
        .then(({ data }) => {
          if (data && !disposed) {
            objectUrl = URL.createObjectURL(
              new Blob([data], { type: file.mime_type }),
            );
            setUrl(objectUrl);
          }
        });
    }
    return () => {
      disposed = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file.object_key, file.mime_type]);
  return url ? (
    <img className="document-thumbnail" src={url} alt="" />
  ) : (
    <FileText size={48} strokeWidth={1} />
  );
}
