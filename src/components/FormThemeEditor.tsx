"use client";

import {
  FONT_SIZE_LABELS,
  CORNER_RADIUS_LABELS,
  type FormTheme,
  type FontSizeKey,
  type CornerRadiusKey,
} from "@/lib/formTheme";

const COLOR_FIELDS: { key: keyof FormTheme; label: string; defaultValue: string }[] = [
  { key: "cardBackgroundColor", label: "Card background", defaultValue: "#FFFFFF" },
  { key: "textColor", label: "Text color", defaultValue: "#18181B" },
  { key: "accentColor", label: "Accent color", defaultValue: "#7C3AED" },
  { key: "ctaBackgroundColor", label: "Button background", defaultValue: "#7C3AED" },
  { key: "ctaTextColor", label: "Button text", defaultValue: "#FFFFFF" },
];

export function FormThemeEditor({
  theme,
  onChange,
}: {
  theme: FormTheme;
  onChange: (theme: FormTheme) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Font size
          <select
            value={theme.fontSize ?? "md"}
            onChange={(e) => onChange({ ...theme, fontSize: e.target.value as FontSizeKey })}
            className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none"
          >
            {(Object.keys(FONT_SIZE_LABELS) as FontSizeKey[]).map((k) => (
              <option key={k} value={k}>
                {FONT_SIZE_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Corners
          <select
            value={theme.cornerRadius ?? "md"}
            onChange={(e) => onChange({ ...theme, cornerRadius: e.target.value as CornerRadiusKey })}
            className="rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 outline-none"
          >
            {(Object.keys(CORNER_RADIUS_LABELS) as CornerRadiusKey[]).map((k) => (
              <option key={k} value={k}>
                {CORNER_RADIUS_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {COLOR_FIELDS.map(({ key, label, defaultValue }) => (
          <div key={key} className="flex flex-col gap-1 text-sm">
            {label}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={(theme[key] as string | undefined) ?? defaultValue}
                onChange={(e) => onChange({ ...theme, [key]: e.target.value })}
                className="h-9 w-9 shrink-0 rounded border border-black/15 dark:border-white/20 bg-transparent p-0.5 cursor-pointer"
              />
              {theme[key] && (
                <button
                  type="button"
                  onClick={() => onChange({ ...theme, [key]: undefined })}
                  className="text-xs text-black/40 dark:text-white/40 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
