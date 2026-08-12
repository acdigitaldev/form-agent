"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function AccountMenu({ email, workspaceName }: { email: string; workspaceName: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-black/10 dark:border-white/10 bg-background shadow-lg py-1 z-10">
          <div className="px-3 py-2 border-b border-black/10 dark:border-white/10">
            <p className="text-sm font-medium truncate">{workspaceName}</p>
            <p className="text-xs text-black/50 dark:text-white/50 truncate">{email}</p>
          </div>
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            Settings
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
