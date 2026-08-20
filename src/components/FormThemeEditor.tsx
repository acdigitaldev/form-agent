"use client";

import {
  FONT_SIZE_LABELS,
  CORNER_RADIUS_LABELS,
  type FormTheme,
  type FontSizeKey,
  type CornerRadiusKey,
} from "@/lib/formTheme";
import { ColorSwatchPicker } from "@/components/ColorSwatchPicker";

const NEUTRAL_PRESETS = ["#FFFFFF", "#F4F4F5", "#E4E4E7", "#18181B", "#0B0B0E"];
const TEXT_PRESETS = ["#18181B", "#3F3F46", "#71717A", "#FFFFFF"];
const BRAND_PRESETS = ["#7C3AED", "#2563EB", "#059669", "#DC2626", "#EA580C", "#DB2777", "#18181B"];
const CTA_TEXT_PRESETS = ["#FFFFFF", "#18181B"];

const COLOR_FIELDS: { key: keyof FormTheme; label: string; defaultValue: string; presets: string[] }[] = [
  { key: "cardBackgroundColor", label: "Card background", defaultValue: "#FFFFFF", presets: NEUTRAL_PRESETS },
  { key: "textColor", label: "Text color", defaultValue: "#18181B", presets: TEXT_PRESETS },
  { key: "accentColor", label: "Accent color", defaultValue: "#7C3AED", presets: BRAND_PRESETS },
  { key: "ctaBackgroundColor", label: "Button background", defaultValue: "#7C3AED", presets: BRAND_PRESETS },
  { key: "ctaTextColor", label: "Button text", defaultValue: "#FFFFFF", presets: CTA_TEXT_PRESETS },
];

export function FormThemeEditor({
  theme,
  onChange,
}: {
  theme: FormTheme;
  onChange: (theme: FormTheme) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
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

      <div className="flex flex-col gap-4">
        {COLOR_FIELDS.map(({ key, label, defaultValue, presets }) => (
          <div key={key} className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span>{label}</span>
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
            <ColorSwatchPicker
              value={(theme[key] as string | undefined) ?? defaultValue}
              presets={presets}
              onChange={(hex) => onChange({ ...theme, [key]: hex })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
