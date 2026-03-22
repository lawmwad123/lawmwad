"use client";

import { Database, Layers, Zap } from "lucide-react";
import type { Session } from "@/lib/types";
import { RISK_COLORS } from "@/lib/vertical-config";
import { cn } from "@/lib/cn";

interface Props {
  session:      Session;
  onQueryClick: (q: string) => void;
}

export function ChatSidebar({ session, onQueryClick }: Props) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Data info */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
          <Database className="w-3.5 h-3.5" />
          Dataset
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Schema</span>
            <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-300">{session.schema_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Entities</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{session.entity_count}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Actions</span>
            <span className={cn("text-xs font-medium", session.actions_enabled ? "text-green-600 dark:text-green-400" : "text-gray-400")}>
              {session.actions_enabled ? `${session.available_actions.length} enabled` : "Read-only"}
            </span>
          </div>
        </div>
      </div>

      {/* Sample queries */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
          <Layers className="w-3.5 h-3.5" />
          Sample Questions
        </div>
        <div className="space-y-1.5">
          {session.sample_queries.map((q, i) => (
            <button
              key={i}
              onClick={() => onQueryClick(q)}
              className="w-full text-left text-xs text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 px-3 py-2 rounded-lg transition-colors leading-snug"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Available actions */}
        {session.actions_enabled && session.available_actions.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
              <Zap className="w-3.5 h-3.5" />
              Available Actions
            </div>
            <div className="space-y-2">
              {session.available_actions.map((action) => (
                <div key={action.action_type} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{action.display_name}</span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", RISK_COLORS[action.risk_level])}>
                      {action.risk_level}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">{action.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
