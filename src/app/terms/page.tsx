import Link from "next/link";
import { LegalPageLayout, LegalSection, LegalP } from "@/components/LegalPage";

export const metadata = { title: "Terms & Conditions — AgentForms" };

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      updated="August 20, 2026"
      intro={
        <>
          This is a template agreement, not a substitute for legal advice — review it with a lawyer before
          relying on it, and replace the bracketed placeholders below with your own details.
        </>
      }
    >
      <LegalSection title="Acceptance">
        <LegalP>
          By creating an account or using AgentForms, you agree to these terms. If you&apos;re using
          AgentForms on behalf of an organization, you&apos;re confirming you have authority to bind it.
        </LegalP>
      </LegalSection>

      <LegalSection title="The service">
        <LegalP>
          AgentForms lets you build forms, host them at a public URL, and collect submissions — either
          through the dashboard or through an AI agent connected via MCP or our REST API. Free and Pro
          plans have different feature sets, described on <Link href="/pricing" className="underline">Pricing</Link>.
        </LegalP>
      </LegalSection>

      <LegalSection title="Accounts">
        <LegalP>
          You&apos;re responsible for keeping your login credentials and connector tokens confidential, and
          for all activity under your account — including anything an AI agent does using a token you
          issued it. Revoke a token immediately from Connectors if you suspect it&apos;s been exposed.
        </LegalP>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <LegalP>You may not use AgentForms to:</LegalP>
        <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-black/70 dark:text-white/70">
          <li>Collect data unlawfully, or without the notice/consent your jurisdiction requires</li>
          <li>Distribute malware, phishing content, or illegal material — including through file uploads</li>
          <li>Attempt to circumvent rate limits, storage quotas, or plan restrictions</li>
          <li>Scrape, resell, or redistribute the service itself outside your own forms and data</li>
          <li>Send spam, or use public forms to harvest data from third parties without their knowledge</li>
        </ul>
        <LegalP>We may suspend or terminate accounts that violate this section.</LegalP>
      </LegalSection>

      <LegalSection title="Your content">
        <LegalP>
          You own the forms you create and the submissions they collect. You grant us a license to host,
          process, and display that content solely to operate the service on your behalf — we don&apos;t
          claim ownership of it, and we don&apos;t use it for anything else.
        </LegalP>
        <LegalP>
          You&apos;re responsible for the content and legality of the fields you collect, any files
          visitors upload to your forms, and any consent notices you configure.
        </LegalP>
      </LegalSection>

      <LegalSection title="File uploads">
        <LegalP>
          Pro plans support file upload fields, subject to per-file size limits, a per-form field count
          cap, and a per-workspace storage quota shown in the dashboard. Uploaded files are stored at an
          unguessable, randomly generated URL but are not otherwise access-restricted — don&apos;t collect
          files containing highly sensitive data unless that&apos;s an acceptable tradeoff for your use
          case. You&apos;re responsible for the legality of files your forms accept.
        </LegalP>
      </LegalSection>

      <LegalSection title="Plans and billing">
        <LegalP>
          Plan features and pricing are described on the Pricing page and may change with notice. Where
          billing is handled through a third-party payment processor, that processor&apos;s terms also
          apply to the transaction.
        </LegalP>
      </LegalSection>

      <LegalSection title="Termination">
        <LegalP>
          You can delete your account at any time from Settings, which deletes your workspace and its
          forms. We may suspend or terminate access for violating these terms, with notice where
          practical.
        </LegalP>
      </LegalSection>

      <LegalSection title="Disclaimers">
        <LegalP>
          AgentForms is provided &quot;as is&quot; without warranties of any kind. We don&apos;t guarantee
          uninterrupted or error-free operation, and we&apos;re not liable for indirect, incidental, or
          consequential damages arising from your use of the service, to the maximum extent the law
          allows.
        </LegalP>
      </LegalSection>

      <LegalSection title="Governing law">
        <LegalP>These terms are governed by the laws of [your jurisdiction] — fill this in before publishing.</LegalP>
      </LegalSection>

      <LegalSection title="Changes">
        <LegalP>
          We may update these terms as the product changes. Continued use after an update means you accept
          the revised terms.
        </LegalP>
      </LegalSection>

      <LegalSection title="Contact">
        <LegalP>
          Questions about these terms? Reach us via{" "}
          <a href="https://growthwithalex.com/" target="_blank" rel="noreferrer" className="underline">
            growthwithalex.com
          </a>
          . See also our <Link href="/privacy" className="underline">Privacy Policy</Link> and{" "}
          <Link href="/security" className="underline">Security</Link> page.
        </LegalP>
      </LegalSection>
    </LegalPageLayout>
  );
}
