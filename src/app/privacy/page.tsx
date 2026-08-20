import Link from "next/link";
import { LegalPageLayout, LegalSection, LegalP } from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy — AgentForms" };

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      updated="August 20, 2026"
      intro={
        <>
          This policy is a plain-language template, not a substitute for legal advice — review it with a
          lawyer before relying on it for compliance in your jurisdiction.
        </>
      }
    >
      <LegalSection title="Two kinds of data, two roles">
        <LegalP>
          AgentForms handles two distinct kinds of personal data, and we play a different role for each:
        </LegalP>
        <LegalP>
          <strong>Account data.</strong> When you sign up for AgentForms, we are the <em>data controller</em>{" "}
          for your account information — your email, workspace name, plan, and connector tokens.
        </LegalP>
        <LegalP>
          <strong>Submission data.</strong> When someone fills out a form you built, we are only the{" "}
          <em>data processor</em>. You (the form owner) are the controller — you decide what fields to
          collect and why, and you&apos;re responsible for having a lawful basis to collect them and for
          the GDPR notice text shown on your form. If you are a visitor who submitted a form and want your
          data removed, please contact the person or company that form belongs to, not us directly.
        </LegalP>
      </LegalSection>

      <LegalSection title="What we collect">
        <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-black/70 dark:text-white/70">
          <li><strong>Account:</strong> email address, a bcrypt hash of your password, workspace name, plan.</li>
          <li><strong>Team:</strong> teammate emails and roles, for workspaces that invite members (Pro).</li>
          <li><strong>Connector tokens:</strong> stored as one-way hashes — we can revoke them, but can&apos;t recover the raw value.</li>
          <li><strong>Form definitions:</strong> the name, fields, and settings of forms you build.</li>
          <li><strong>Submission data:</strong> whatever values a visitor enters into the fields you define — could include names, emails, free text, or uploaded files on Pro plans.</li>
          <li><strong>Submission metadata:</strong> the submitting IP address and user-agent string, kept for spam and abuse prevention.</li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use it">
        <LegalP>
          To operate the service: authenticate you, render your forms, store and display submissions back
          to you, run the MCP/API connectors you set up, and enforce plan limits. To prevent abuse: rate
          limiting and a spam honeypot on public form submissions. We do not sell personal data, and we do
          not use submission data for advertising.
        </LegalP>
      </LegalSection>

      <LegalSection title="Where it's stored">
        <LegalP>
          AgentForms runs on Vercel (application hosting, edge network, and file storage for Pro file
          uploads) with a managed Postgres database on Neon. Both are our subprocessors and maintain their
          own security and compliance programs. We don&apos;t operate our own data centers — everything
          passes through these providers.
        </LegalP>
      </LegalSection>

      <LegalSection title="Retention">
        <LegalP>
          Data is kept for as long as the related account or form exists. Deleting a form deletes its
          submissions and any files uploaded to it. Deleting your account deletes your workspace, its
          forms, and everything in it. There is currently no automatic time-based deletion beyond that —
          if you need submissions purged on a schedule, export and delete them manually via the dashboard
          or API.
        </LegalP>
      </LegalSection>

      <LegalSection title="Your rights">
        <LegalP>
          Depending on where you live, you may have rights to access, correct, export, or delete your
          personal data, and to object to or restrict certain processing. For account data, contact us
          (below) and we&apos;ll act on it directly. For data submitted through someone else&apos;s form,
          we can only pass your request along — the form owner controls that data.
        </LegalP>
      </LegalSection>

      <LegalSection title="International transfers">
        <LegalP>
          Our subprocessors operate infrastructure in multiple regions, including the United States and the
          EU. Where data crosses borders, we rely on our subprocessors&apos; own transfer safeguards (such
          as standard contractual clauses).
        </LegalP>
      </LegalSection>

      <LegalSection title="Cookies">
        <LegalP>
          We use a single session cookie to keep you signed in. We don&apos;t currently use third-party
          advertising or tracking cookies.
        </LegalP>
      </LegalSection>

      <LegalSection title="Children">
        <LegalP>AgentForms is not directed at children under 16, and we don&apos;t knowingly collect their data.</LegalP>
      </LegalSection>

      <LegalSection title="Changes">
        <LegalP>
          We may update this policy as the product changes. Material changes will be reflected by updating
          the date at the top of this page.
        </LegalP>
      </LegalSection>

      <LegalSection title="Contact">
        <LegalP>
          Questions about this policy? Reach us via{" "}
          <a href="https://growthwithalex.com/" target="_blank" rel="noreferrer" className="underline">
            growthwithalex.com
          </a>
          . See also our <Link href="/security" className="underline">Security</Link> page and{" "}
          <Link href="/terms" className="underline">Terms &amp; Conditions</Link>.
        </LegalP>
      </LegalSection>
    </LegalPageLayout>
  );
}
