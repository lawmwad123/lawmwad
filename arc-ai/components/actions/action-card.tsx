"use client";

import { CheckCircle, XCircle, AlertTriangle, Zap, ArrowRight } from "lucide-react";
import type { ActionPlan, RecordDiffField } from "@/lib/types";
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

        {/* Record context — who/what is being changed */}
        {plan.record_preview && Object.keys(plan.record_preview).length > 0 && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Record</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {Object.entries(plan.record_preview).slice(0, 4).map(([k, v]) => (
                <span key={k} className="text-xs text-gray-700 dark:text-gray-300">
                  <span className="text-gray-400">{k.replace(/_/g, " ")}: </span>
                  <span className="font-medium">{String(v)}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Human-readable diff — what will change */}
        {plan.record_diff && plan.record_diff.length > 0 ? (
          <div className="mb-4">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Changes</div>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {plan.record_diff.map((d: RecordDiffField, i: number) => (
                <div
                  key={d.field}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-xs",
                    i > 0 && "border-t border-gray-100 dark:border-gray-800"
                  )}
                >
                  <span className="text-gray-500 dark:text-gray-400 shrink-0 w-24 truncate">
                    {d.field.replace(/_/g, " ")}
                  </span>
                  <span className="line-through text-red-400 dark:text-red-500 truncate max-w-[90px]">{d.old}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="font-semibold text-green-600 dark:text-green-400 truncate max-w-[90px]">{d.new}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Fallback: legacy param display for sandbox registered actions */
          Object.keys(plan.params).length > 0 && (
            <div className="space-y-1.5 mb-4">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Parameters</div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(plan.params).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">{k.replace(/_/g, " ")}:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )
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
