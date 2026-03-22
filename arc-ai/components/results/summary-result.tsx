"use client";

import type { AgentResult } from "@/lib/types";
import { TableResult } from "./table-result";
import { ChartResult }  from "./chart-result";

export function SummaryResult({ result }: { result: AgentResult }) {
  // Summary results may have both data (table) and a text summary
  // For action confirmation, this is handled by ActionCard in message-list
  if (result.action_plan) return null; // Rendered as ActionCard

  return (
    <div className="space-y-3">
      {result.data && result.data.length > 0 && (
        result.data.length <= 6 && Object.keys(result.data[0]).length <= 2
          ? <ChartResult result={{ ...result, chart_type: "progress" }} />
          : <TableResult result={result} />
      )}
    </div>
  );
}
