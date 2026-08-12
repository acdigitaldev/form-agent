import Link from "next/link";

const ARTICLES = [
  { id: "getting-started", title: "Getting started" },
  { id: "connecting-agents", title: "Connecting an agent" },
  { id: "field-types", title: "Field types" },
  { id: "gdpr", title: "GDPR & privacy notices" },
  { id: "embedding", title: "Embedding a form" },
  { id: "api-reference", title: "API reference" },
  { id: "faq", title: "FAQ" },
];

export default function DocsPage() {
  return (
    <div className="flex gap-10">
      <nav className="hidden md:block w-48 shrink-0">
        <ul className="sticky top-24 flex flex-col gap-1 text-sm">
          {ARTICLES.map((a) => (
            <li key={a.id}>
              <a href={`#${a.id}`} className="block py-1 text-black/60 dark:text-white/60 hover:text-foreground">
                {a.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex-1 max-w-2xl flex flex-col gap-14">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Docs</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">
            Everything you need to create forms, capture leads, and connect agents.
          </p>
        </div>

        <Article id="getting-started" title="Getting started">
          <P>
            AgentForms has two ways to create a form: click <strong>New form</strong> in the dashboard and
            walk through the four-step wizard, or connect an agent (Claude, ChatGPT, or any MCP client)
            and just ask it to create one for you. Both paths land in the same place — every form gets a
            hosted public URL under <code>/f/&lt;slug&gt;</code> that anyone can fill out, no account
            required on their end.
          </P>
          <P>
            Submissions from every form show up in <Link href="/dashboard/submissions" className="underline">Submissions</Link>,
            with basic analytics on top and a per-form filter.
          </P>
        </Article>

        <Article id="connecting-agents" title="Connecting an agent">
          <P>
            Go to <Link href="/dashboard/connectors" className="underline">Connectors</Link> and generate a
            token. That gives you a ready-to-use server URL:
          </P>
          <Pre>{`https://<your-domain>/api/mcp/<token>`}</Pre>
          <P>
            Paste that URL into Claude Desktop&apos;s custom connector settings, run{" "}
            <code>claude mcp add --transport http</code> for Claude Code, or point any other MCP client
            that supports remote servers at it — no extra headers or OAuth flow needed, the token in the
            URL is the only credential required. For ChatGPT, use the OpenAPI action instead: import{" "}
            <code>/openapi.json</code> and authenticate with the raw token as a Bearer key. Step-by-step
            instructions for each client live on the Connectors page itself.
          </P>
          <P>
            Once connected, the agent has six tools available: <code>create_form</code>,{" "}
            <code>list_forms</code>, <code>get_form</code>, <code>update_form</code>,{" "}
            <code>delete_form</code>, and <code>list_submissions</code>.
          </P>
        </Article>

        <Article id="field-types" title="Field types">
          <P>Each form field has a type that controls how it renders and validates on the public page:</P>
          <ul className="list-disc pl-5 flex flex-col gap-1 text-sm">
            <li><code>text</code> — single-line text</li>
            <li><code>email</code> — validated email address</li>
            <li><code>phone</code> — phone number input</li>
            <li><code>textarea</code> — multi-line text</li>
            <li><code>select</code> — dropdown, needs an <code>options</code> list</li>
            <li><code>checkbox</code> — single checkbox</li>
            <li><code>number</code> — numeric input</li>
            <li><code>url</code> — link input</li>
          </ul>
        </Article>

        <Article id="gdpr" title="GDPR & privacy notices">
          <P>
            Every form has an editable privacy notice that renders as small print under the submit button
            on the public page — no consent checkbox required, just clear disclosure of what happens to
            the data. Edit it per form under <strong>Settings</strong> on that form&apos;s detail page, or
            during step 3 of the creation wizard. This is plain text, not legal advice — adjust the
            wording to match your actual data handling and jurisdiction.
          </P>
        </Article>

        <Article id="embedding" title="Embedding a form">
          <P>
            Every form detail page has a ready-made <code>&lt;iframe&gt;</code> snippet under{" "}
            <strong>Public link</strong>. Paste it into any site. The embedded version drops the dashboard
            chrome automatically via the <code>?embed=1</code> query parameter.
          </P>
        </Article>

        <Article id="api-reference" title="API reference">
          <P>
            The full REST API — the same one the MCP connector and dashboard both use — is documented as
            an OpenAPI 3.1 schema at <code>/openapi.json</code>. Authenticate with{" "}
            <code>Authorization: Bearer &lt;token&gt;</code> using a token from Connectors.
          </P>
        </Article>

        <Article id="faq" title="FAQ">
          <P>
            <strong>Can I have a team?</strong> Yes — invite people from{" "}
            <Link href="/dashboard/settings" className="underline">Settings</Link>. Owners can invite,
            remove members, and manage tokens; members can create and edit forms.
          </P>
          <P>
            <strong>What happens if I revoke a connector token?</strong> Any agent using it loses access
            immediately — existing forms and submissions are untouched.
          </P>
          <P>
            <strong>Is there spam protection on public forms?</strong> Yes — a hidden honeypot field and a
            per-IP rate limit on submissions.
          </P>
        </Article>
      </div>
    </div>
  );
}

function Article({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{children}</p>;
}

function Pre({ children }: { children: React.ReactNode }) {
  return <pre className="text-xs rounded bg-black/5 dark:bg-white/10 p-3 overflow-x-auto">{children}</pre>;
}
