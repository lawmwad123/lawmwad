"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import type { EditableField } from "@/lib/vertical-views";
import { cn } from "@/lib/cn";

interface Props {
  entity:   string;
  mode:     "create" | "edit";
  fields:   EditableField[];
  /** Row values to pre-populate in edit mode */
  initial?: Record<string, unknown>;
  onSave:   (data: Record<string, unknown>) => Promise<void>;
  onClose:  () => void;
}

export function RecordDrawer({ entity, mode, fields, initial = {}, onSave, onClose }: Props) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      const v = initial[f.key];
      init[f.key] = v !== undefined && v !== null ? String(v) : "";
    }
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      // Coerce values by inputType
      const data: Record<string, unknown> = {};
      for (const f of fields) {
        const raw = form[f.key];
        if (raw === "" || raw === undefined) { data[f.key] = null; continue; }
        if (f.inputType === "number")  { data[f.key] = Number(raw); continue; }
        if (f.inputType === "boolean") { data[f.key] = raw === "true"; continue; }
        data[f.key] = raw;
      }
      await onSave(data);
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {mode === "create" ? `Add ${entity}` : `Edit ${entity}`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">

          {/* Fields */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  {f.label}
                  {f.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <FieldInput field={f} value={form[f.key] ?? ""} onChange={(v) => set(f.key, v)} />
              </div>
            ))}

            {error && (
              <p className="text-[12px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {saving
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                : <><Save className="w-3.5 h-3.5" /> Save</>
              }
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─── Field input ──────────────────────────────────────────────────────────────

function FieldInput({
  field,
  value,
  onChange,
}: {
  field:    EditableField;
  value:    string;
  onChange: (v: string) => void;
}) {
  const base = cn(
    "w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200",
    "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg",
    "focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors",
  );

  if (field.inputType === "textarea") {
    return (
      <textarea
        className={cn(base, "resize-none")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        rows={3}
      />
    );
  }

  if (field.inputType === "boolean") {
    return (
      <select className={base} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">— select —</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    );
  }

  if (field.inputType === "select") {
    return (
      <select
        className={base}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
      >
        <option value="">— select —</option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={field.inputType === "number" ? "number" : field.inputType === "date" ? "date" : "text"}
      className={base}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      step={field.inputType === "number" ? "any" : undefined}
    />
  );
}
