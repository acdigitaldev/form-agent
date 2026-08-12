"use client";

import { useState } from "react";

type Member = { membershipId: string; userId: string; email: string; role: string };
type PendingInvite = { id: string; email: string; role: string; createdAt: string };

export function TeamManager({
  initialMembers,
  initialInvites,
  currentUserId,
  canManage,
}: {
  initialMembers: Member[];
  initialInvites: PendingInvite[];
  currentUserId: string;
  canManage: boolean;
}) {
  const [members, setMembers] = useState(initialMembers);
  const [invites, setInvites] = useState(initialInvites);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "owner">("member");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Enter an email address");
      return;
    }
    setSending(true);
    const res = await fetch("/api/v1/team/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    setSending(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to send invite");
      return;
    }
    const body = await res.json();
    setInvites([{ ...body.invite, createdAt: body.invite.createdAt }, ...invites]);
    setInviteUrl(body.inviteUrl);
    setEmail("");
  }

  async function handleRevokeInvite(id: string) {
    const res = await fetch(`/api/v1/team/invites/${id}`, { method: "DELETE" });
    if (res.ok) setInvites(invites.filter((i) => i.id !== id));
  }

  async function handleRemoveMember(membershipId: string) {
    if (!confirm("Remove this person from the workspace?")) return;
    const res = await fetch(`/api/v1/team/members/${membershipId}`, { method: "DELETE" });
    if (res.ok) {
      setMembers(members.filter((m) => m.membershipId !== membershipId));
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Failed to remove member");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="font-medium mb-3">Members</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-black/50 dark:text-white/50">
            <tr>
              <th className="py-2 font-medium">Email</th>
              <th className="py-2 font-medium">Role</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.membershipId} className="border-t border-black/10 dark:border-white/10">
                <td className="py-2">
                  {m.email} {m.userId === currentUserId && <span className="text-black/40 dark:text-white/40">(you)</span>}
                </td>
                <td className="py-2 capitalize">{m.role}</td>
                <td className="py-2 text-right">
                  {canManage && m.userId !== currentUserId && (
                    <button
                      onClick={() => handleRemoveMember(m.membershipId)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {canManage && (
        <section className="flex flex-col gap-4">
          <h2 className="font-medium">Invite someone</h2>

          {inviteUrl && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 flex flex-col gap-2">
              <p className="text-sm font-medium">
                Share this link — there&apos;s no email sending set up yet, so send it yourself
              </p>
              <code className="text-sm break-all">{inviteUrl}</code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(inviteUrl);
                  setInviteUrl(null);
                }}
                className="self-start text-sm rounded-md border border-black/15 dark:border-white/20 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10"
              >
                Copy &amp; dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleInvite} className="flex items-end gap-3 flex-wrap">
            <label className="flex flex-col gap-1 text-sm flex-1 min-w-[200px]">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teammate@company.com"
                className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:focus:border-white/40"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Role
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "member" | "owner")}
                className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none"
              >
                <option value="member">Member</option>
                <option value="owner">Owner</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={sending}
              className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send invite"}
            </button>
          </form>
          {error && <p className="text-sm text-red-600">{error}</p>}

          {invites.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Pending invites</p>
              <table className="w-full text-sm">
                <tbody>
                  {invites.map((i) => (
                    <tr key={i.id} className="border-t border-black/10 dark:border-white/10">
                      <td className="py-2">{i.email}</td>
                      <td className="py-2 capitalize text-black/50 dark:text-white/50">{i.role}</td>
                      <td className="py-2 text-right">
                        <button onClick={() => handleRevokeInvite(i.id)} className="text-red-600 hover:underline">
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
