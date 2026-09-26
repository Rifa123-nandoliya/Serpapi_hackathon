"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type TagInputProps = {
  id: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  invalid?: boolean;
  describedBy?: string;
};

/** Type a name and press Enter or comma to add it; Backspace on an empty input removes the last tag. */
export function TagInput({ id, value, onChange, placeholder, max = 10, invalid, describedBy }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const full = value.length >= max;

  function commit(raw: string) {
    const tag = raw.trim().replace(/,+$/, "").trim();
    if (!tag || full) return;
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  }

  return (
    <div
      className={cn(
        "flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2 py-1.5 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        invalid && "border-destructive ring-destructive/20",
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-muted py-1 pr-1 pl-2.5 text-sm text-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={`Remove ${tag}`}
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        disabled={full}
        onChange={(e) => {
          const next = e.target.value;
          if (next.endsWith(",")) commit(next);
          else setDraft(next);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(draft);
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => commit(draft)}
        placeholder={full ? `Maximum ${max} reached` : value.length ? "Add another…" : placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="h-8 min-w-32 flex-1 bg-transparent px-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
    </div>
  );
}
