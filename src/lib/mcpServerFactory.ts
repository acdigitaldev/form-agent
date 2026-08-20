import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  listForms,
  createForm,
  getForm,
  updateForm,
  deleteForm,
  listSubmissionsForForm,
  SlugTakenError,
} from "@/lib/formsService";
import { FORM_TEMPLATES, getTemplate } from "@/lib/templates";
import { isPro } from "@/lib/plan";
import { hasFileField, slugSchema } from "@/lib/formFields";
import { formThemeSchema } from "@/lib/formTheme";

const fieldTypeSchema = z
  .enum(["text", "email", "phone", "textarea", "select", "checkbox", "number", "url", "file"])
  .describe("Input type to render for this field. 'file' is Pro only — end-users upload a file (e.g. a CV or image) directly on the form.");

const fieldSchema = z.object({
  id: z.string().describe("Stable key for this field, used as the key in submission data (e.g. 'email')"),
  label: z.string().describe("Human-readable label shown on the form"),
  type: fieldTypeSchema,
  required: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional().describe("Choices for type='select'"),
  placeholderLabel: z
    .boolean()
    .optional()
    .describe("Show the label inside the input as placeholder text instead of above it"),
});

function textResult(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function errorResult(message: string) {
  return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
}

const PRO_REQUIRED = "Webhooks are a Pro feature. Upgrade from Settings to use them.";
const PRO_REQUIRED_FILE = "File upload fields are a Pro feature. Upgrade from Settings to use them.";
const PRO_REQUIRED_LOGO = "A custom logo is a Pro feature. Upgrade from Settings to use it.";

/** Builds a fresh MCP server scoped to one workspace. Cheap — safe to build per-request. */
export function buildMcpServerForWorkspace(workspace: { id: string; plan: string }) {
  const workspaceId = workspace.id;
  const server = new McpServer({ name: "agentforms", version: "1.0.0" });

  server.registerTool(
    "create_form",
    {
      title: "Create a form",
      description:
        "Create a new lead-capture form and get back a hosted public URL that anyone can fill out. Use this whenever the user wants a new form, survey, or signup page.",
      inputSchema: {
        name: z.string().describe("Short name for the form, e.g. 'Newsletter signup'"),
        description: z.string().optional(),
        fields: z.array(fieldSchema).min(1).describe("The fields end-users will fill in, in order"),
        successMessage: z.string().optional(),
        redirectUrl: z.string().url().optional(),
        gdprText: z.string().optional().describe("Privacy/consent notice shown below the submit button"),
        ctaText: z.string().optional().describe("Submit button label, defaults to 'Submit'"),
        webhookUrl: z.string().url().optional().describe("Pro only — POSTed on every submission"),
        slug: slugSchema.optional().describe("Custom public link slug, e.g. 'my-form' for /f/my-form. Auto-generated from the name if omitted."),
        publicTitle: z.string().optional().describe("Overrides the browser tab title on the public form page; defaults to the form name"),
        theme: formThemeSchema.optional().describe(
          "Visual design overrides for the public page: fontSize ('sm'|'md'|'lg'), cornerRadius ('none'|'sm'|'md'|'lg'|'full'), and hex colors cardBackgroundColor/textColor/accentColor/ctaBackgroundColor/ctaTextColor"
        ),
      },
    },
    async (input) => {
      if (input.webhookUrl && !isPro(workspace)) return errorResult(PRO_REQUIRED);
      if (hasFileField(input.fields) && !isPro(workspace)) return errorResult(PRO_REQUIRED_FILE);
      try {
        return textResult({ form: await createForm(workspaceId, input) });
      } catch (err) {
        if (err instanceof SlugTakenError) return errorResult(err.message);
        return errorResult(String(err));
      }
    }
  );

  server.registerTool(
    "list_templates",
    {
      title: "List form templates",
      description:
        "List the built-in form templates (newsletter, contact, demo request, survey, event RSVP, job application) with their ids and pre-filled fields. Use before create_form_from_template.",
      inputSchema: {},
    },
    async () =>
      textResult({
        templates: FORM_TEMPLATES.map((t) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          fields: t.fields,
        })),
      })
  );

  server.registerTool(
    "create_form_from_template",
    {
      title: "Create a form from a template",
      description:
        "Create a new form pre-filled from a built-in template in one call — the fastest way to spin up a newsletter signup, contact form, demo request, survey, event RSVP, or job application. Call list_templates first if you don't already know the template id.",
      inputSchema: {
        templateId: z.enum(FORM_TEMPLATES.map((t) => t.id) as [string, ...string[]]),
        name: z.string().optional().describe("Override the template's default form name"),
        extraFields: z
          .array(fieldSchema)
          .optional()
          .describe("Additional custom fields to append after the template's fields"),
      },
    },
    async ({ templateId, name, extraFields }) => {
      const template = getTemplate(templateId);
      if (!template) return errorResult(`Unknown template id: ${templateId}`);
      if (extraFields && hasFileField(extraFields) && !isPro(workspace)) return errorResult(PRO_REQUIRED_FILE);

      try {
        const form = await createForm(workspaceId, {
          name: name ?? template.name,
          fields: [...template.fields, ...(extraFields ?? [])],
          ctaText: template.ctaText,
          successMessage: template.successMessage,
        });
        return textResult({ form });
      } catch (err) {
        return errorResult(String(err));
      }
    }
  );

  server.registerTool(
    "list_forms",
    {
      title: "List forms",
      description: "List all forms in this workspace, with their public URLs and submission counts.",
      inputSchema: {},
    },
    async () => textResult({ forms: await listForms(workspaceId) })
  );

  server.registerTool(
    "get_form",
    {
      title: "Get a form",
      description: "Get the full definition of a single form by its id.",
      inputSchema: { formId: z.string() },
    },
    async ({ formId }) => {
      const form = await getForm(workspaceId, formId);
      return form ? textResult({ form }) : errorResult("Form not found");
    }
  );

  server.registerTool(
    "update_form",
    {
      title: "Update a form",
      description:
        "Update a form's name, description, fields, success message, redirect URL, GDPR notice, or active status. Only include fields you want to change.",
      inputSchema: {
        formId: z.string(),
        name: z.string().optional(),
        description: z.string().nullable().optional(),
        fields: z.array(fieldSchema).optional(),
        successMessage: z.string().optional(),
        redirectUrl: z.string().url().nullable().optional(),
        gdprText: z.string().optional(),
        ctaText: z.string().optional(),
        webhookUrl: z.string().url().nullable().optional().describe("Pro only — POSTed on every submission"),
        isActive: z.boolean().optional().describe("Set false to pause the form"),
        slug: slugSchema.optional().describe("Custom public link slug, e.g. 'my-form' for /f/my-form"),
        publicTitle: z.string().nullable().optional().describe("Overrides the browser tab title on the public form page"),
        logoUrl: z.string().url().nullable().optional().describe("Pro only — image URL shown above the form on the public page"),
        theme: formThemeSchema.nullable().optional().describe(
          "Visual design overrides for the public page: fontSize ('sm'|'md'|'lg'), cornerRadius ('none'|'sm'|'md'|'lg'|'full'), and hex colors cardBackgroundColor/textColor/accentColor/ctaBackgroundColor/ctaTextColor. Pass null to reset to defaults."
        ),
      },
    },
    async ({ formId, ...patch }) => {
      if (patch.webhookUrl && !isPro(workspace)) return errorResult(PRO_REQUIRED);
      if (patch.fields && hasFileField(patch.fields) && !isPro(workspace)) return errorResult(PRO_REQUIRED_FILE);
      if (patch.logoUrl && !isPro(workspace)) return errorResult(PRO_REQUIRED_LOGO);
      try {
        const form = await updateForm(workspaceId, formId, patch);
        return form ? textResult({ form }) : errorResult("Form not found");
      } catch (err) {
        if (err instanceof SlugTakenError) return errorResult(err.message);
        return errorResult(String(err));
      }
    }
  );

  server.registerTool(
    "delete_form",
    {
      title: "Delete a form",
      description: "Permanently delete a form and all of its submissions. This cannot be undone.",
      inputSchema: { formId: z.string() },
    },
    async ({ formId }) => {
      const deleted = await deleteForm(workspaceId, formId);
      return deleted ? textResult({ ok: true }) : errorResult("Form not found");
    }
  );

  server.registerTool(
    "list_submissions",
    {
      title: "List submissions / leads",
      description: "List the leads/submissions a form has received, most recent first.",
      inputSchema: { formId: z.string(), limit: z.number().int().min(1).max(200).optional() },
    },
    async ({ formId, limit }) => {
      const result = await listSubmissionsForForm(workspaceId, formId, limit);
      return result ? textResult(result) : errorResult("Form not found");
    }
  );

  return server;
}
