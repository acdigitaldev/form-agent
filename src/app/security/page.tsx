import Link from "next/link";
import { LegalPageLayout, LegalSection, LegalP } from "@/components/LegalPage";

export const metadata = { title: "Security — AgentForms" };

export default function SecurityPage() {
  return (
    <LegalPageLayout title="Security" updated="August 20, 2026">
      <LegalSection title="Infrastructure">
        <LegalP>
          AgentForms is hosted on Vercel (application, edge network, and Pro file storage) with a managed
          Postgres database on Neon. We don&apos;t run our own servers — both providers maintain their own
          security and compliance programs, which you can review on their respective sites.
        </LegalP>
      </LegalSection>

      <LegalSection title="Encryption">
        <LegalP>
          All traffic to and from AgentForms is served over HTTPS/TLS. Data at rest is encrypted by our
          infrastructure providers at the storage layer.
        </LegalP>
      </LegalSection>

      <LegalSection title="Authentication & secrets">
        <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-black/70 dark:text-white/70">
          <li>Passwords are hashed with bcrypt — we never store them in plain text.</li>
          <li>Dashboard sessions use signed, HttpOnly cookies.</li>
          <li>Connector (API) tokens are stored as one-way hashes; we can revoke them but can&apos;t retrieve the raw value once issued.</li>
          <li>Workspace data is scoped by workspace id on every query — one workspace can&apos;t read another&apos;s forms or submissions.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Abuse prevention">
        <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-black/70 dark:text-white/70">
          <li>Public form submissions are rate-limited per form and per IP address.</li>
          <li>A hidden honeypot field silently discards obvious bot submissions.</li>
          <li>File uploads are validated by content type and size, and rate-limited per workspace and per IP.</li>
          <li>Per-workspace storage quotas cap total file upload volume.</li>
        </ul>
      </LegalSection>

      <LegalSection title="File uploads">
        <LegalP>
          Files uploaded to Pro forms are stored at an unguessable, randomly generated URL. This is
          convenience-level obscurity, not encryption or access control — anyone with the exact URL can
          view the file. Don&apos;t collect highly sensitive files through a public form unless that
          tradeoff is acceptable for your use case.
        </LegalP>
      </LegalSection>

      <LegalSection title="Reporting a vulnerability">
        <LegalP>
          If you find a security issue, please report it to us via{" "}
          <a href="https://growthwithalex.com/" target="_blank" rel="noreferrer" className="underline">
            growthwithalex.com
          </a>{" "}
          rather than filing a public issue. We&apos;ll acknowledge reports and work on a fix before any
          public disclosure.
        </LegalP>
      </LegalSection>

      <LegalSection title="Related">
        <LegalP>
          See also our <Link href="/privacy" className="underline">Privacy Policy</Link> for how we handle
          personal data, and our <Link href="/terms" className="underline">Terms &amp; Conditions</Link>.
        </LegalP>
      </LegalSection>
    </LegalPageLayout>
  );
}
