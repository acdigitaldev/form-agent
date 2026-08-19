import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShellHeader, AppShellFooter } from "@/components/AppShellHeader";
import { PublicFormWizard } from "./PublicFormWizard";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="flex-1 flex flex-col">
      <AppShellHeader active="forms" />

      <div className="mx-auto max-w-5xl w-full px-6 py-12 flex-1 flex flex-col gap-8">
        <div className="text-center flex flex-col items-center gap-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Build your form</h1>
          <p className="text-black/60 dark:text-white/60">
            No account needed to try it — build, preview, and only sign up when you&apos;re ready to
            publish and start capturing real submissions. Every form also gets a direct connection to
            Claude, ChatGPT, and any MCP client.
          </p>
        </div>

        <PublicFormWizard />
      </div>

      <AppShellFooter />
    </main>
  );
}
