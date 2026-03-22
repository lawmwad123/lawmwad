"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, Moon, Sun, Code2, LogOut, ChevronDown } from "lucide-react";
import { useSessionStore, useUIStore } from "@/lib/store";
import { VERTICAL_ICONS, VERTICAL_COLORS } from "@/lib/vertical-config";
import type { Session } from "@/lib/types";
import { cn } from "@/lib/cn";
import { useState } from "react";

const ROLES = ["analyst", "manager", "admin", "readonly"];

export function ChatHeader({ session }: { session: Session }) {
  const router = useRouter();
  const { userRole, setUserRole, clearSession } = useSessionStore();
  const { darkMode, showSql, toggleDark, toggleSql } = useUIStore();
  const [showRoles, setShowRoles] = useState(false);

  const icon   = VERTICAL_ICONS[session.vertical]  ?? "🗄️";
  const colors = VERTICAL_COLORS[session.vertical] ?? VERTICAL_COLORS.custom;

  async function endSession() {
    clearSession();
    await fetch("/api/session", {
      method:  "DELETE",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ session_id: session.session_id }),
    }).catch(() => {});
    router.push("/demo");
  }

  return (
    <header className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-3 gap-2 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-3 h-3 text-white" />
        </div>
        <span className="font-semibold text-sm text-gray-900 dark:text-white">DataMind</span>
      </div>

      {/* Vertical badge */}
      <div className={cn(
        "flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border",
        colors.bg, colors.border, colors.text
      )}>
        <span>{icon}</span>
        <span className="max-w-[110px] truncate">{session.org_name}</span>
      </div>

      <div className="flex-1" />

      {/* Role switcher */}
      <div className="relative">
        <button
          onClick={() => setShowRoles((s) => !s)}
          className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          {userRole}
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>
        {showRoles && (
          <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => { setUserRole(r); setShowRoles(false); }}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs transition-colors",
                  r === userRole
                    ? "bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SQL toggle */}
      <button
        onClick={toggleSql}
        title={showSql ? "Hide SQL" : "Show SQL"}
        className={cn(
          "p-1.5 rounded-md transition-colors",
          showSql
            ? "bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        <Code2 className="w-3.5 h-3.5" />
      </button>

      {/* Dark mode */}
      <button
        onClick={toggleDark}
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </button>

      {/* End session */}
      <button
        onClick={endSession}
        title="End session"
        className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </header>
  );
}
