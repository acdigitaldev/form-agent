import { AppShellHeader, AppShellFooter } from "@/components/AppShellHeader";

export function LegalPageLayout({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 flex flex-col">
      <AppShellHeader />
      <div className="mx-auto max-w-2xl w-full px-6 py-16 flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-black/50 dark:text-white/50 mt-1">Last updated {updated}</p>
          {intro && <div className="mt-4 text-sm text-black/70 dark:text-white/70 leading-relaxed">{intro}</div>}
        </div>
        {children}
      </div>
      <AppShellFooter />
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{children}</p>;
}
