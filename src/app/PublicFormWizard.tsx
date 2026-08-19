"use client";

import { useRouter } from "next/navigation";
import { FormWizard } from "@/components/FormWizard";
import { saveDraftForm, type DraftForm } from "@/lib/draftForm";

export function PublicFormWizard() {
  const router = useRouter();

  async function handleSubmit(payload: DraftForm) {
    saveDraftForm(payload);
    router.push("/register?draft=1");
  }

  return (
    <FormWizard
      submitLabel="Create your free account"
      onSubmit={handleSubmit}
      secondaryAction={{
        label: "Already have an account? Log in",
        onClick: (payload) => {
          saveDraftForm(payload);
          router.push("/login?draft=1");
        },
      }}
    />
  );
}
