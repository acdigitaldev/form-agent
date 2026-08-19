const STEPS = [
  { emoji: "💬", label: "You", caption: "“Create a demo request form”" },
  { emoji: "🤖", label: "Claude", caption: "or any MCP / GPT client" },
  { emoji: "🔌", label: "AgentForms", caption: "one hosted MCP connector" },
  { emoji: "📝", label: "Hosted form", caption: "live URL, instantly" },
  { emoji: "📊", label: "Your dashboard", caption: "every submission, in real time" },
];

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-black/25 dark:text-white/25 shrink-0 hidden sm:block"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-black/25 dark:text-white/25 shrink-0 sm:hidden"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

export function McpFlowDiagram() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full">
      {STEPS.map((step, i) => (
        <div key={step.label} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center gap-1.5 w-32 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05] text-2xl">
              {step.emoji}
            </div>
            <p className="text-sm font-medium">{step.label}</p>
            <p className="text-xs text-black/50 dark:text-white/50 leading-tight">{step.caption}</p>
          </div>
          {i < STEPS.length - 1 && (
            <>
              <ArrowRight />
              <ArrowDown />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
