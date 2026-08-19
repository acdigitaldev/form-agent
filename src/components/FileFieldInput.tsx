"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

export function FileFieldInput({
  fieldId,
  formSlug,
  value,
  onChange,
}: {
  fieldId: string;
  /** Real uploads only happen when a live form slug is provided; otherwise this renders inert (e.g. in dashboard previews). */
  formSlug?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(value ? "done" : "idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!formSlug) {
    return (
      <div className="rounded-md border border-dashed border-black/15 dark:border-white/20 px-3 py-2 text-sm text-black/40 dark:text-white/40">
        File upload — active on the live form
      </div>
    );
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    setError(null);
    setFileName(file.name);

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: `/api/public/forms/${formSlug}/upload-token`,
        clientPayload: JSON.stringify({ fieldId }),
      });
      onChange(blob.url);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
      onChange("");
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        type="file"
        onChange={handleFile}
        disabled={status === "uploading"}
        className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-black/5 dark:file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:font-medium"
      />
      {status === "uploading" && (
        <span className="text-xs text-black/50 dark:text-white/50">Uploading {fileName}…</span>
      )}
      {status === "done" && <span className="text-xs text-green-600">Uploaded {fileName ?? "file"}</span>}
      {status === "error" && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
