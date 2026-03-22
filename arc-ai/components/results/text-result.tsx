"use client";

import type { AgentResult } from "@/lib/types";

export function TextResult({ result }: { result: AgentResult }) {
  return (
    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
      {result.text}
    </div>
  );
}
