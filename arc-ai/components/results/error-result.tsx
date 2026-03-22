"use client";

import { AlertCircle } from "lucide-react";
import type { AgentResult } from "@/lib/types";

export function ErrorResult({ result }: { result: AgentResult }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
      <div>
        <div className="text-sm font-medium text-red-700 dark:text-red-300 mb-0.5">Something went wrong</div>
        <div className="text-xs text-red-600 dark:text-red-400">{result.error ?? result.text}</div>
      </div>
    </div>
  );
}
