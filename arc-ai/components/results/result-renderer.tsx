"use client";

import type { AgentResult } from "@/lib/types";
import { TextResult }    from "./text-result";
import { StatsResult }   from "./stats-result";
import { TableResult }   from "./table-result";
import { ChartResult }   from "./chart-result";
import { SummaryResult } from "./summary-result";
import { ErrorResult }   from "./error-result";
import { SqlViewer }     from "./sql-viewer";
import { SuggestedFollowups } from "./suggested-followups";
import { useUIStore }    from "@/lib/store";

interface Props {
  result: AgentResult;
}

export function ResultRenderer({ result }: Props) {
  const { showSql } = useUIStore();

  const renderContent = () => {
    switch (result.template_type) {
      case "stats":
        return <StatsResult result={result} />;
      case "table":
        return <TableResult result={result} />;
      case "chart":
        return <ChartResult result={result} />;
      case "summary":
      case "comparison":
        return <SummaryResult result={result} />;
      case "error":
        return <ErrorResult result={result} />;
      case "text":
      default:
        return null; // text is in the bubble
    }
  };

  const content = renderContent();
  const hasSuggestions = result.suggested_followups && result.suggested_followups.length > 0;
  const hasSql = result.sql_query;

  if (!content && !hasSuggestions && !hasSql) return null;

  return (
    <div className="mt-2 space-y-3 animate-fade-up">
      {content}

      {hasSql && showSql && (
        <SqlViewer sql={result.sql_query!} tables={result.source_tables} />
      )}

      {hasSuggestions && (
        <SuggestedFollowups followups={result.suggested_followups!} />
      )}
    </div>
  );
}
