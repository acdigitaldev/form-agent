"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

export function LogoUploadInput({
  formId,
  logoUrl,
  onChange,
}: {
  formId: string;
  logoUrl: string;
  onChange: (url: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    setError(null);

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: `/api/v1/forms/${formId}/logo-upload-token`,
      });
      onChange(blob.url);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {logoUrl && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Current logo" className="h-10 rounded border border-black/10 dark:border-white/10 bg-white object-contain px-1" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm text-red-600 hover:underline"
          >
            Remove logo
          </button>
        </div>
      )}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        onChange={handleFile}
        disabled={status === "uploading"}
        className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-black/5 dark:file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:font-medium"
      />
      {status === "uploading" && (
        <span className="text-xs text-black/50 dark:text-white/50">Uploading…</span>
      )}
      {status === "error" && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
