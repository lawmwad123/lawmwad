"use client";

import { Loader2, CheckCircle2 } from "lucide-react";
import type { ProgressStep } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ProgressBar({ steps }: { steps: ProgressStep[] }) {
  const visible = steps.filter((s) => s.visible);
  if (!visible.length) return null;

  return (
    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-4 overflow-x-auto">
      {visible.map((step, i) => {
        const done    = step.status === "done";
        const active  = step.status === "running";
        return (
          <div key={step.step} className={cn("flex items-center gap-1.5 flex-shrink-0 text-xs", done ? "text-green-600 dark:text-green-400" : active ? "text-brand-600 dark:text-brand-400" : "text-gray-400")}>
            {i > 0 && <span className="text-gray-200 dark:text-gray-700 mr-1">→</span>}
            {done
              ? <CheckCircle2 className="w-3.5 h-3.5" />
              : active
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <span className="w-3.5 h-3.5 rounded-full border border-current" />
            }
            {step.step}
          </div>
        );
      })}
    </div>
  );
}
