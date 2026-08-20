import { z } from "zod";

export const FONT_SIZE_PRESETS = { sm: 14, md: 16, lg: 18 } as const;
export const CORNER_RADIUS_PRESETS = { none: 0, sm: 6, md: 10, lg: 16, full: 999 } as const;

export type FontSizeKey = keyof typeof FONT_SIZE_PRESETS;
export type CornerRadiusKey = keyof typeof CORNER_RADIUS_PRESETS;

export const FONT_SIZE_LABELS: Record<FontSizeKey, string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
};

export const CORNER_RADIUS_LABELS: Record<CornerRadiusKey, string> = {
  none: "Square",
  sm: "Slight",
  md: "Rounded",
  lg: "Extra rounded",
  full: "Pill",
};

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color like #7C3AED");

export const formThemeSchema = z
  .object({
    fontSize: z.enum(["sm", "md", "lg"]).optional(),
    cornerRadius: z.enum(["none", "sm", "md", "lg", "full"]).optional(),
    cardBackgroundColor: hexColor.optional(),
    textColor: hexColor.optional(),
    accentColor: hexColor.optional(),
    ctaBackgroundColor: hexColor.optional(),
    ctaTextColor: hexColor.optional(),
  })
  .strict();

export type FormTheme = z.infer<typeof formThemeSchema>;

export function parseTheme(raw: string | null | undefined): FormTheme {
  if (!raw) return {};
  try {
    return formThemeSchema.parse(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function serializeTheme(theme: FormTheme): string {
  return JSON.stringify(formThemeSchema.parse(theme));
}

/** Fully-resolved, ready-to-render theme values — defaults match the app's own violet design system. */
export function resolveTheme(theme: FormTheme | null | undefined) {
  return {
    fontSizePx: FONT_SIZE_PRESETS[theme?.fontSize ?? "md"],
    radiusPx: CORNER_RADIUS_PRESETS[theme?.cornerRadius ?? "md"],
    cardBackgroundColor: theme?.cardBackgroundColor,
    textColor: theme?.textColor,
    accentColor: theme?.accentColor ?? "#7C3AED",
    ctaBackgroundColor: theme?.ctaBackgroundColor ?? theme?.accentColor ?? "#7C3AED",
    ctaTextColor: theme?.ctaTextColor ?? "#FFFFFF",
  };
}

export type ResolvedFormTheme = ReturnType<typeof resolveTheme>;
