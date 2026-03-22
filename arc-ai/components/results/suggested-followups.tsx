"use client";

import { Sparkles } from "lucide-react";

// Forward click to parent via a custom event so ChatShell can handle it
export function SuggestedFollowups({ followups }: { followups: string[] }) {
  function dispatch(q: string) {
    window.dispatchEvent(new CustomEvent("demo:followup", { detail: q }));
  }

  return (
    <div className="flex flex-wrap gap-2">
      {followups.map((q, i) => (
        <button
          key={i}
          onClick={() => dispatch(q)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          {q}
        </button>
      ))}
    </div>
  );
}
