#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { apiRequest, ApiError } from "./client.js";

const server = new McpServer({ name: "agentforms", version: "0.1.0" });

const fieldTypeSchema = z
  .enum(["text", "email", "phone", "textarea", "select", "checkbox", "number", "url"])
  .describe("Input type to render for this field");

const fieldSchema = z.object({
  id: z.string().describe("Stable key for this field, used as the key in submission data (e.g. 'email')"),
  label: z.string().describe("Human-readable label shown on the form"),
  type: fieldTypeSchema,
  required: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional().describe("Choices for type='select'"),
});

function textResult(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function errorResult(err: unknown) {
  const message = err instanceof ApiError ? `${err.status}: ${err.message}` : String(err);
  return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
}

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
      redirectUrl: z.string().url().optional().describe("If set, redirect here instead of showing successMessage"),
      gdprText: z.string().optional().describe("Privacy/consent notice shown below the submit button"),
      ctaText: z.string().optional().describe("Submit button label, defaults to 'Submit'"),
    },
  },
  async (input) => {
    try {
      const result = await apiRequest("/api/v1/forms", { method: "POST", body: JSON.stringify(input) });
      return textResult(result);
    } catch (err) {
      return errorResult(err);
    }
  }
);

server.registerTool(
  "list_forms",
  {
    title: "List forms",
    description: "List all forms you've created, with their public URLs and submission counts.",
    inputSchema: {},
  },
  async () => {
    try {
      const result = await apiRequest("/api/v1/forms");
      return textResult(result);
    } catch (err) {
      return errorResult(err);
    }
  }
);

server.registerTool(
  "get_form",
  {
    title: "Get a form",
    description: "Get the full definition of a single form by its id.",
    inputSchema: { formId: z.string() },
  },
  async ({ formId }) => {
    try {
      const result = await apiRequest(`/api/v1/forms/${formId}`);
      return textResult(result);
    } catch (err) {
      return errorResult(err);
    }
  }
);

server.registerTool(
  "update_form",
  {
    title: "Update a form",
    description:
      "Update a form's name, description, fields, success message, redirect URL, or active status. Only include fields you want to change.",
    inputSchema: {
      formId: z.string(),
      name: z.string().optional(),
      description: z.string().nullable().optional(),
      fields: z.array(fieldSchema).optional(),
      successMessage: z.string().optional(),
      redirectUrl: z.string().url().nullable().optional(),
      gdprText: z.string().optional(),
      ctaText: z.string().optional(),
      isActive: z.boolean().optional().describe("Set false to pause the form and stop accepting submissions"),
    },
  },
  async ({ formId, ...patch }) => {
    try {
      const result = await apiRequest(`/api/v1/forms/${formId}`, { method: "PATCH", body: JSON.stringify(patch) });
      return textResult(result);
    } catch (err) {
      return errorResult(err);
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
    try {
      const result = await apiRequest(`/api/v1/forms/${formId}`, { method: "DELETE" });
      return textResult(result);
    } catch (err) {
      return errorResult(err);
    }
  }
);

server.registerTool(
  "list_submissions",
  {
    title: "List submissions / leads",
    description: "List the leads/submissions a form has received, most recent first.",
    inputSchema: {
      formId: z.string(),
      limit: z.number().int().min(1).max(200).optional(),
    },
  },
  async ({ formId, limit }) => {
    try {
      const query = limit ? `?limit=${limit}` : "";
      const result = await apiRequest(`/api/v1/forms/${formId}/submissions${query}`);
      return textResult(result);
    } catch (err) {
      return errorResult(err);
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[agentforms-mcp] connected");
