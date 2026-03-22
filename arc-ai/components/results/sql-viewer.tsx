"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";

interface Props {
  sql:    string;
  tables?: string[];
}

export function SqlViewer({ sql, tables }: Props) {
  const [open,    setOpen]    = useState(false);
  const [copied,  setCopied]  = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden text-xs">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span className="font-medium">View SQL</span>
          {tables && tables.length > 0 && (
            <span className="text-gray-400">
              — {tables.join(", ")}
            </span>
          )}
        </div>
        {open && (
          <button
            onClick={(e) => { e.stopPropagation(); copy(); }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </button>
      {open && (
        <pre className="p-4 bg-gray-900 dark:bg-gray-950 text-green-400 overflow-x-auto leading-relaxed font-mono text-[11px] whitespace-pre-wrap">
          {sql}
        </pre>
      )}
    </div>
  );
}
