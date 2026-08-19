import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseFields } from "@/lib/formFields";
import { isRateLimited } from "@/lib/rateLimit";
import { isPro } from "@/lib/plan";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HONEYPOT_KEY = "_hp";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ip = getClientIp(req);

  if (isRateLimited(`submit:${slug}:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many submissions, please try again shortly" }, { status: 429 });
  }

  const form = await prisma.form.findUnique({ where: { slug }, include: { workspace: true } });
  if (!form || !form.isActive) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  // Honeypot: bots that fill hidden fields get a fake success, nothing is stored.
  if (typeof body[HONEYPOT_KEY] === "string" && body[HONEYPOT_KEY].length > 0) {
    return NextResponse.json({ ok: true, message: form.successMessage, redirectUrl: form.redirectUrl });
  }

  const fields = parseFields(form.fields);
  const errors: Record<string, string> = {};
  const data: Record<string, unknown> = {};

  for (const field of fields) {
    const value = body[field.id];
    const isEmpty = value === undefined || value === null || value === "";

    if (field.required && isEmpty) {
      errors[field.id] = `${field.label} is required`;
      continue;
    }
    if (isEmpty) continue;

    if (field.type === "email" && typeof value === "string" && !EMAIL_RE.test(value)) {
      errors[field.id] = `${field.label} must be a valid email`;
      continue;
    }
    if (field.type === "select" && field.options && !field.options.includes(String(value))) {
      errors[field.id] = `${field.label} must be one of the allowed options`;
      continue;
    }

    data[field.id] = value;
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", fieldErrors: errors }, { status: 422 });
  }

  const submission = await prisma.submission.create({
    data: {
      formId: form.id,
      data: JSON.stringify(data),
      sourceIp: ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    },
  });

  if (form.webhookUrl && isPro(form.workspace)) {
    // Awaited (bounded to 4s) rather than fire-and-forget — serverless functions
    // aren't guaranteed to keep running background work after the response is sent.
    await fireWebhook(form.webhookUrl, {
      formId: form.id,
      formName: form.name,
      submissionId: submission.id,
      submittedAt: submission.createdAt.toISOString(),
      data,
    });
  }

  return NextResponse.json({ ok: true, message: form.successMessage, redirectUrl: form.redirectUrl });
}

/** Best-effort, bounded-time POST — a slow/broken webhook must never block or fail the submission. */
async function fireWebhook(url: string, payload: unknown) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch {
    // swallow — webhook delivery is best-effort
  }
}
