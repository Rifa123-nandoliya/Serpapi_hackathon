"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CATEGORIES,
  fieldErrors,
  ideaSchema,
  MAX_COMPETITORS,
  type FieldErrors,
  type IdeaFormValues,
} from "@/lib/schemas";
import type { NewStartupInput } from "@/lib/types";

import { FormField, fieldAria } from "./form-field";
import { TagInput } from "./tag-input";

const EMPTY: IdeaFormValues = {
  name: "",
  idea: "",
  category: "" as IdeaFormValues["category"],
  location: "",
  targetCustomer: "",
  knownCompetitors: [],
};

type IdeaFormProps = { onSubmit: (input: NewStartupInput) => void };

export function IdeaForm({ onSubmit }: IdeaFormProps) {
  const [values, setValues] = useState<IdeaFormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<IdeaFormValues>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(next: IdeaFormValues) {
    const result = ideaSchema.safeParse(next);
    setErrors(result.success ? {} : fieldErrors<IdeaFormValues>(result.error));
    return result;
  }

  function update<K extends keyof IdeaFormValues>(key: K, value: IdeaFormValues[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (submitted) validate(next);
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
        onSubmit({
          name: data.name,
          idea: data.idea,
          category: data.category,
          location: data.location,
          targetCustomer: data.targetCustomer,
          knownCompetitors: data.knownCompetitors,
          mode: "idea",
        });
      }}
      className="space-y-6"
    >
      <FormField id="idea-name" label="Startup name" error={errors.name}>
        <Input
          {...fieldAria("idea-name", errors.name)}
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Brew & Stay"
          autoComplete="off"
          className="h-11"
        />
      </FormField>

      <FormField
        id="idea-idea"
        label="Your idea"
        hint={`${values.idea.trim().length}/20 characters minimum`}
        error={errors.idea}
      >
        <Textarea
          {...fieldAria("idea-idea", errors.idea, true)}
          value={values.idea}
          onChange={(e) => update("idea", e.target.value)}
          placeholder="What are you building, for whom, and what makes it different?"
          rows={4}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id="idea-category" label="Category" error={errors.category}>
          <Select
            value={values.category}
            onValueChange={(v) => update("category", v as IdeaFormValues["category"])}
          >
            <SelectTrigger {...fieldAria("idea-category", errors.category)} className="h-11! w-full">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="idea-location" label="Location" error={errors.location}>
          <Input
            {...fieldAria("idea-location", errors.location)}
            value={values.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="e.g. Andheri West, Mumbai"
            className="h-11"
          />
        </FormField>
      </div>

      <FormField id="idea-customer" label="Target customer" error={errors.targetCustomer}>
        <Input
          {...fieldAria("idea-customer", errors.targetCustomer)}
          value={values.targetCustomer}
          onChange={(e) => update("targetCustomer", e.target.value)}
          placeholder="e.g. Freelancers and students aged 20–35"
          className="h-11"
        />
      </FormField>

      <FormField
        id="idea-competitors"
        label="Known competitors"
        optional
        hint={`Press Enter or comma after each name. Up to ${MAX_COMPETITORS}.`}
        error={errors.knownCompetitors}
      >
        <TagInput
          id="idea-competitors"
          value={values.knownCompetitors}
          onChange={(tags) => update("knownCompetitors", tags)}
          placeholder="e.g. Bean Theory"
          max={MAX_COMPETITORS}
          invalid={Boolean(errors.knownCompetitors)}
          describedBy={errors.knownCompetitors ? "idea-competitors-error" : "idea-competitors-hint"}
        />
      </FormField>

      <FormActions onReset={reset} />
    </form>
  );
}

export function FormActions({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
      <Button type="button" variant="subtle" size="xl" onClick={onReset}>
        <RotateCcw aria-hidden="true" />
        Add another startup
      </Button>
      <Button type="submit" variant="gradient" size="xl">
        Analyse startup
        <ArrowRight aria-hidden="true" />
      </Button>
    </div>
  );
}
