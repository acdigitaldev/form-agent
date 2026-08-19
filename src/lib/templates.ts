import type { FormField } from "@/lib/formFields";

export type FormTemplate = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  fields: FormField[];
  ctaText?: string;
  successMessage?: string;
};

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "newsletter",
    name: "Newsletter signup",
    emoji: "📰",
    description: "One field, maximum conversions.",
    fields: [{ id: "email", label: "Email", type: "email", required: true }],
    ctaText: "Subscribe",
    successMessage: "You're in! Check your inbox to confirm.",
  },
  {
    id: "contact",
    name: "Contact form",
    emoji: "✉️",
    description: "Standard name, email, and message.",
    fields: [
      { id: "name", label: "Name", type: "text", required: true },
      { id: "email", label: "Email", type: "email", required: true },
      { id: "message", label: "Message", type: "textarea", required: true },
    ],
    ctaText: "Send message",
    successMessage: "Thanks for reaching out — we'll get back to you soon.",
  },
  {
    id: "demo-request",
    name: "Demo request",
    emoji: "🎯",
    description: "Qualify inbound leads before a sales call.",
    fields: [
      { id: "name", label: "Name", type: "text", required: true },
      { id: "workEmail", label: "Work email", type: "email", required: true },
      { id: "company", label: "Company", type: "text", required: true },
      {
        id: "companySize",
        label: "Company size",
        type: "select",
        required: true,
        options: ["1-10", "11-50", "51-200", "201-1000", "1000+"],
      },
    ],
    ctaText: "Request a demo",
    successMessage: "Thanks! Someone from our team will reach out to schedule your demo.",
  },
  {
    id: "survey",
    name: "Customer survey",
    emoji: "📊",
    description: "Quick satisfaction + open feedback.",
    fields: [
      {
        id: "satisfaction",
        label: "How satisfied are you with us?",
        type: "select",
        required: true,
        options: ["Very satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very unsatisfied"],
      },
      { id: "feedback", label: "What could we do better?", type: "textarea", required: false },
      { id: "email", label: "Email (optional, if you'd like a reply)", type: "email", required: false },
    ],
    ctaText: "Submit feedback",
    successMessage: "Thanks for the feedback — it genuinely helps.",
  },
  {
    id: "event-rsvp",
    name: "Event RSVP",
    emoji: "🎟️",
    description: "Headcount and dietary needs for an event.",
    fields: [
      { id: "name", label: "Full name", type: "text", required: true },
      { id: "email", label: "Email", type: "email", required: true },
      { id: "attending", label: "Will you attend?", type: "select", required: true, options: ["Yes", "No"] },
      { id: "guests", label: "Number of guests", type: "number", required: false },
      { id: "dietary", label: "Dietary restrictions", type: "text", required: false },
    ],
    ctaText: "RSVP",
    successMessage: "You're on the list — see you there!",
  },
  {
    id: "job-application",
    name: "Job application",
    emoji: "💼",
    description: "Lightweight first-pass candidate intake.",
    fields: [
      { id: "name", label: "Full name", type: "text", required: true },
      { id: "email", label: "Email", type: "email", required: true },
      { id: "resumeUrl", label: "Resume / portfolio link", type: "url", required: true },
      { id: "role", label: "Role you're applying for", type: "text", required: true },
      { id: "notes", label: "Anything else we should know?", type: "textarea", required: false },
    ],
    ctaText: "Submit application",
    successMessage: "Thanks for applying — we review every application and will follow up.",
  },
];

export function getTemplate(id: string): FormTemplate | undefined {
  return FORM_TEMPLATES.find((t) => t.id === id);
}
