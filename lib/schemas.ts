import { z } from "zod";

export const CATEGORIES = [
  "Food & beverage",
  "EdTech",
  "FinTech",
  "HealthTech",
  "E-commerce",
  "SaaS",
  "Consumer app",
  "Local services",
  "Other",
] as const;

export const MAX_REPORT_BYTES = 10 * 1024 * 1024;
export const REPORT_EXTENSIONS = [".pdf", ".docx"] as const;
export const REPORT_ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const MAX_COMPETITORS = 10;

/** Returns an error message for a report file, or null when it is acceptable. */
export function reportFileError(file: { name: string; size: number }): string | null {
  const name = file.name.toLowerCase();
  if (!REPORT_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return "Upload a .pdf or .docx file.";
  }
  if (file.size > MAX_REPORT_BYTES) return "The file must be 10 MB or smaller.";
  if (file.size === 0) return "This file is empty.";
  return null;
}

const name = z
  .string()
  .trim()
  .min(2, "Enter a name of at least 2 characters.")
  .max(60, "Keep the name under 60 characters.");

export const ideaSchema = z.object({
  name,
  idea: z
    .string()
    .trim()
    .min(20, "Describe your idea in at least 20 characters.")
    .max(600, "Keep the description under 600 characters."),
  category: z.enum(CATEGORIES, { error: "Choose a category." }),
  location: z.string().trim().min(2, "Enter where you will operate, e.g. \"Pune\" or \"India (online)\"."),
  targetCustomer: z.string().trim().min(3, "Describe who your customers are."),
  knownCompetitors: z
    .array(z.string().trim().min(1).max(60, "Keep each competitor name under 60 characters."))
    .max(MAX_COMPETITORS, `Add at most ${MAX_COMPETITORS} competitors.`),
});

export type IdeaFormValues = z.input<typeof ideaSchema>;

/** Accepts "example.com" as well as "https://example.com". */
const optionalWebsite = z
  .string()
  .trim()
  .transform((value) => (value && !/^https?:\/\//i.test(value) ? `https://${value}` : value))
  .refine((value) => value === "" || isValidHttpUrl(value), "Enter a valid website, e.g. example.com.");

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export const existingSchema = z.object({
  name,
  website: optionalWebsite,
  reportFile: z
    .object({ name: z.string(), size: z.number() })
    .nullable()
    .superRefine((file, ctx) => {
      const message = file ? reportFileError(file) : null;
      if (message) ctx.addIssue({ code: "custom", message });
    }),
  compareAgainst: z
    .string()
    .trim()
    .min(10, "Tell us what to compare against in at least 10 characters.")
    .max(600, "Keep this under 600 characters."),
});

export type ExistingFormValues = z.input<typeof existingSchema>;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** First error message per top-level field. */
export function fieldErrors<T>(error: z.ZodError): FieldErrors<T> {
  const out: Partial<Record<string, string>> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out as FieldErrors<T>;
}
