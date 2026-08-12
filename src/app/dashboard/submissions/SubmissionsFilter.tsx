"use client";

import { useRouter } from "next/navigation";

export function SubmissionsFilter({
  forms,
  selectedFormId,
}: {
  forms: { id: string; name: string }[];
  selectedFormId?: string;
}) {
  const router = useRouter();

  return (
    <select
      value={selectedFormId ?? ""}
      onChange={(e) => {
        const value = e.target.value;
        router.push(value ? `/dashboard/submissions?formId=${value}` : "/dashboard/submissions");
      }}
      className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
    >
      <option value="">All forms</option>
      {forms.map((f) => (
        <option key={f.id} value={f.id}>
          {f.name}
        </option>
      ))}
    </select>
  );
}
