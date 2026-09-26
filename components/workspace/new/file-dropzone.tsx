"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/format";
import { REPORT_ACCEPT, reportFileError } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  id: string;
  file: File | null;
  onChange: (file: File | null) => void;
  /** Error from form validation (shown by the parent FormField). */
  invalid?: boolean;
  describedBy?: string;
  /** Called with a message when a dropped/selected file is rejected. */
  onReject: (message: string) => void;
};

/** Drag-and-drop (or click / keyboard) picker for a .pdf or .docx report up to 10 MB. */
export function FileDropzone({ id, file, onChange, invalid, describedBy, onReject }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function accept(candidate: File | undefined) {
    if (!candidate) return;
    const message = reportFileError(candidate);
    if (message) {
      onReject(message);
      return;
    }
    onChange(candidate);
  }

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 pr-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <FileText aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            onChange(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          aria-label={`Remove ${file.name}`}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        accept(e.dataTransfer.files[0]);
      }}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card px-6 py-8 text-center transition-colors",
        dragging && "border-brand bg-brand-soft",
        invalid && "border-destructive/60",
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-background text-muted-foreground shadow-soft">
        <UploadCloud aria-hidden="true" className="size-5" />
      </span>
      <p className="mt-3 text-sm text-foreground">
        <span className="font-medium">Drag and drop your report</span> or{" "}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded font-medium text-brand underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          browse files
        </button>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">PDF or DOCX, up to 10 MB</p>
      <input
        ref={inputRef}
        id={id}
        type="file"
        tabIndex={-1}
        accept={REPORT_ACCEPT}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="sr-only"
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
