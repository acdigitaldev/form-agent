"use client";

import { useRef } from "react";

export function ColorSwatchPicker({
  value,
  presets,
  onChange,
}: {
  value: string;
  presets: string[];
  onChange: (hex: string) => void;
}) {
  const customInputRef = useRef<HTMLInputElement>(null);
  const normalized = value.toLowerCase();
  const isCustom = !presets.some((p) => p.toLowerCase() === normalized);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map((color) => {
        const active = color.toLowerCase() === normalized;
        return (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            aria-label={color}
            title={color}
            className={`h-7 w-7 shrink-0 rounded-full border transition-shadow ${
              active
                ? "ring-2 ring-accent ring-offset-2 ring-offset-background border-transparent"
                : "border-black/10 dark:border-white/15 hover:scale-105"
            }`}
            style={{ backgroundColor: color }}
          />
        );
      })}

      <button
        type="button"
        onClick={() => customInputRef.current?.click()}
        aria-label="Custom color"
        title={isCustom ? value : "Custom color"}
        className={`relative h-7 w-7 shrink-0 overflow-hidden rounded-full border ${
          isCustom
            ? "ring-2 ring-accent ring-offset-2 ring-offset-background border-transparent"
            : "border-black/10 dark:border-white/15"
        }`}
        style={{
          background: isCustom ? value : "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
        }}
      >
        <input
          ref={customInputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          tabIndex={-1}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </button>

      <span className="ml-1 font-mono text-xs text-black/40 dark:text-white/40">{value.toUpperCase()}</span>
    </div>
  );
}
