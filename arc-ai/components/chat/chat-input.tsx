"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  onSend:      (text: string) => void;
  disabled:    boolean;
  suggestions: string[];
}

export function ChatInput({ onSend, disabled, suggestions }: Props) {
  const [text, setText]  = useState("");
  const [showSug, setShowSug] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    setShowSug(false);
    if (ref.current) ref.current.style.height = "auto";
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function onInput() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }

  const filtered = text.trim()
    ? suggestions.filter((s) => s.toLowerCase().includes(text.toLowerCase())).slice(0, 4)
    : suggestions.slice(0, 4);

  return (
    <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      {/* Suggestion chips */}
      {!text && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.slice(0, 3).map((s, i) => (
            <button
              key={i}
              onClick={() => { setText(s); ref.current?.focus(); }}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-700 dark:hover:text-brand-300 transition-colors border border-gray-200 dark:border-gray-700 truncate max-w-[240px]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Typeahead dropdown */}
      {showSug && text.trim() && filtered.length > 0 && (
        <div className="mb-2 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
          {filtered.map((s, i) => (
            <button
              key={i}
              onClick={() => { setText(s); setShowSug(false); ref.current?.focus(); }}
              className="w-full text-left text-xs px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={ref}
            value={text}
            onChange={(e) => { setText(e.target.value); setShowSug(true); onInput(); }}
            onKeyDown={onKey}
            onBlur={() => setTimeout(() => setShowSug(false), 150)}
            onFocus={() => setShowSug(true)}
            disabled={disabled}
            rows={1}
            placeholder={disabled ? "Thinking…" : "Ask anything about your data…"}
            className={cn(
              "w-full resize-none rounded-xl border px-4 py-3 text-sm leading-relaxed outline-none transition-colors",
              "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800",
              "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
              "focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900",
              disabled && "opacity-60 cursor-not-allowed"
            )}
          />
        </div>
        <button
          onClick={submit}
          disabled={!text.trim() || disabled}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            text.trim() && !disabled
              ? "bg-brand-600 hover:bg-brand-700 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
          )}
        >
          {disabled
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Send className="w-4 h-4" />
          }
        </button>
      </div>

      <p className="mt-2 text-center text-[10px] text-gray-400">
        AI can make mistakes. Always verify important data. SQL shown on request.
      </p>
    </div>
  );
}
