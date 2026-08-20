/**
 * Two rounded bars inside the mark stand for form fields — a short one nested
 * under a longer one, echoing how AgentForms condenses a form down to just
 * what an agent needs to fill in.
 */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" rx="22" fill="#7C3AED" />
      <rect x="22" y="32" width="52" height="10" rx="5" fill="#FFFFFF" />
      <rect x="22" y="54" width="32" height="10" rx="5" fill="#FFFFFF" opacity="0.7" />
    </svg>
  );
}

export function Logo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <span
        className="font-bold tracking-tight text-foreground whitespace-nowrap"
        style={{ fontSize: size * 0.75 }}
      >
        Agent<span className="font-extrabold">Forms</span>
      </span>
    </span>
  );
}
