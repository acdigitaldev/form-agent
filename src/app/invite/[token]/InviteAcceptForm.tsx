"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function InviteAcceptForm({
  token,
  email,
  userExists,
}: {
  token: string;
  email: string;
  userExists: boolean;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function acceptInvite() {
    return fetch(`/api/public/invites/${token}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userExists ? {} : { password }),
    });
  }

  async function handleExistingUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const signInResult = await signIn("credentials", { email, password, redirect: false });
    if (signInResult?.error) {
      setLoading(false);
      setError("Incorrect password");
      return;
    }

    const res = await acceptInvite();
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to join workspace");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleNewUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);

    const res = await acceptInvite();
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setLoading(false);
      setError(body.error ?? "Failed to join workspace");
      return;
    }

    const signInResult = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInResult?.error) {
      router.push("/login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (userExists) {
    return (
      <form onSubmit={handleExistingUserSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-black/60 dark:text-white/60">
          An account already exists for this email. Enter your password to join.
        </p>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-accent text-white px-4 py-2 font-medium hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Joining…" : "Log in & join"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleNewUserSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Create a password
        <input
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-accent text-white px-4 py-2 font-medium hover:bg-accent-hover disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create account & join"}
      </button>
    </form>
  );
}
