"use client";

import { CheckCircle, XCircle, AlertTriangle, Zap } from "lucide-react";
import type { ActionPlan } from "@/lib/types";
import { RISK_COLORS } from "@/lib/vertical-config";
import { cn } from "@/lib/cn";

interface Props {
  plan:      ActionPlan;
  onApprove: () => void;
  onReject:  () => void;
}

const RISK_ICONS: Record<string, React.ReactNode> = {
  low:      <Zap className="w-4 h-4 text-green-500" />,
  medium:   <AlertTriangle className="w-4 h-4 text-yellow-500" />,
  high:     <AlertTriangle className="w-4 h-4 text-orange-500" />,
  critical: <AlertTriangle className="w-4 h-4 text-red-500" />,
};

export function ActionCard({ plan, onApprove, onReject }: Props) {
  return (
    <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 rounded-2xl overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="px-4 py-3 border-b border-amber-200 dark:border-amber-800 flex items-center gap-2">
        {RISK_ICONS[plan.risk_level] ?? RISK_ICONS.medium}
        <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{plan.display_name}</span>
        <span className={cn("ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium", RISK_COLORS[plan.risk_level])}>
          {plan.risk_level} risk
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{plan.summary}</p>

        {/* Params */}
        {Object.keys(plan.params).length > 0 && (
          <div className="space-y-1.5 mb-4">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Parameters</div>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(plan.params).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">{k.replace(/_/g, " ")}:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SQL preview */}
        {plan.sql_template && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">SQL to execute</div>
            <pre className="text-[11px] font-mono bg-gray-900 text-green-400 rounded-xl px-3 py-2.5 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {plan.sql_template}
            </pre>
          </div>
        )}

        {/* Clarification warning */}
        {plan.clarification_needed && (
          <div className="mb-4 text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900 px-3 py-2 rounded-lg">
            Additional information may be needed. Review carefully before approving.
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Approve & Execute
          </button>
          <button
            onClick={onReject}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
