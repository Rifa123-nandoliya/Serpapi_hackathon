"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { existingSchema, fieldErrors, type ExistingFormValues, type FieldErrors } from "@/lib/schemas";
import type { NewStartupInput } from "@/lib/types";

import { FileDropzone } from "./file-dropzone";
import { FormField, fieldAria } from "./form-field";
import { FormActions } from "./idea-form";

type State = { name: string; website: string; reportFile: File | null; compareAgainst: string };

const EMPTY: State = { name: "", website: "", reportFile: null, compareAgainst: "" };

type ExistingFormProps = { onSubmit: (input: NewStartupInput) => void };

function toSchemaInput(state: State): ExistingFormValues {
  return {
    ...state,
    reportFile: state.reportFile ? { name: state.reportFile.name, size: state.reportFile.size } : null,
  };
}

export function ExistingForm({ onSubmit }: ExistingFormProps) {
  const [values, setValues] = useState<State>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<ExistingFormValues>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(next: State) {
    const result = existingSchema.safeParse(toSchemaInput(next));
    setErrors(result.success ? {} : fieldErrors<ExistingFormValues>(result.error));
    return result;
  }

  function update<K extends keyof State>(key: K, value: State[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (submitted) validate(next);
    else if (key === "reportFile") setErrors((e) => ({ ...e, reportFile: undefined }));
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
    setSubmitted(false);
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        const result = validate(values);
        if (!result.success) {
          const form = e.currentTarget;
          requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
          return;
        }
        const data = result.data;
        let host = "";
        if (data.website) host = new URL(data.website).hostname.replace(/^www\./, "");
        onSubmit({
          name: data.name,
          idea: data.compareAgainst,
          category: "Existing startup",
          location: host || "Online",
          targetCustomer: "Existing customers",
          mode: "existing",
          website: data.website || undefined,
          compareAgainst: data.compareAgainst,
          reportFile: data.reportFile ?? undefined,
        });
      }}
      className="space-y-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id="ex-name" label="Startup name" error={errors.name}>
          <Input
            {...fieldAria("ex-name", errors.name)}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Chai & Chapter"
            autoComplete="organization"
            className="h-11"
          />
        </FormField>
        <FormField id="ex-website" label="Website URL" optional error={errors.website}>
          <Input
            {...fieldAria("ex-website", errors.website)}
            value={values.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="example.com"
            inputMode="url"
            autoComplete="url"
            className="h-11"
          />
        </FormField>
      </div>

      <FormField
        id="ex-report"
        label="Upload a report"
        optional
        hint="A pitch deck, business plan or research doc helps GapScope find the right competitors."
        error={errors.reportFile}
      >
        <FileDropzone
          id="ex-report"
          file={values.reportFile}
          onChange={(file) => update("reportFile", file)}
          onReject={(message) => setErrors((e) => ({ ...e, reportFile: message }))}
          invalid={Boolean(errors.reportFile)}
          describedBy={errors.reportFile ? "ex-report-error" : "ex-report-hint"}
        />
      </FormField>

      <FormField id="ex-compare" label="What should we compare you against?" error={errors.compareAgainst}>
        <Textarea
          {...fieldAria("ex-compare", errors.compareAgainst)}
          value={values.compareAgainst}
          onChange={(e) => update("compareAgainst", e.target.value)}
          placeholder="e.g. Other work-friendly cafés within 3 km of Andheri West metro"
          rows={4}
        />
      </FormField>

      <FormActions onReset={reset} />
    </form>
  );
}
