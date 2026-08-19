"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormWizard } from "@/components/FormWizard";
import type { DraftForm } from "@/lib/draftForm";

export default function NewFormPage() {
  const router = useRouter();

  async function handleSubmit(payload: DraftForm) {
    const res = await fetch("/api/v1/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return body.error ?? "Failed to create form";
    }

    const { form } = await res.json();
    router.push(`/dashboard/forms/${form.id}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/dashboard" className="text-sm text-black/50 dark:text-white/50 hover:underline">
          ← Forms
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">New form</h1>
      </div>

      <FormWizard onSubmit={handleSubmit} />
    </div>
  );
}
