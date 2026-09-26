import { CircleAlert } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

/** Label + control + hint + inline error. Pass `describedBy(id, error)` to the control. */
export function FormField({ id, label, optional, hint, error, className, children }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-xs font-medium text-destructive">
          <CircleAlert aria-hidden="true" className="mt-px size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** aria props for a control inside FormField. */
export function fieldAria(id: string, error: string | undefined, hasHint = false) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hasHint ? `${id}-hint` : undefined,
  } as const;
}
