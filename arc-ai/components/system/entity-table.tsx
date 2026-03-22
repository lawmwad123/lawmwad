"use client";

import { useMemo } from "react";
import type { ColDef, ColType } from "@/lib/vertical-views";
import { cn } from "@/lib/cn";

interface Props {
  columns:       ColDef[];
  rows:          Record<string, unknown>[];
  highlightIds?: Set<string | number>;
  loading?:      boolean;
}

// ─── formatters ──────────────────────────────────────────────────────────────

function fmtCurrency(val: unknown): string {
  const n = Number(val);
  if (isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function fmtDate(val: unknown): string {
  if (!val) return "—";
  const d = new Date(val as string);
  if (isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function fmtNumber(val: unknown): string {
  const n = Number(val);
  if (isNaN(n)) return "—";
  return n.toLocaleString("en-US");
}

function CellValue({ type, value, badges }: { type: ColType; value: unknown; badges?: Record<string, string> }) {
  const str = value === null || value === undefined ? "" : String(value);

  if (type === "currency") {
    return <span className="tabular-nums">{fmtCurrency(value)}</span>;
  }

  if (type === "date") {
    return <span className="text-gray-500">{fmtDate(value)}</span>;
  }

  if (type === "number") {
    return (
      <span className={cn("tabular-nums font-medium", Number(value) === 0 && "text-red-500")}>
        {fmtNumber(value)}
      </span>
    );
  }

  if (type === "badge") {
    const cls = badges?.[str.toLowerCase()] ?? "bg-gray-100 text-gray-600";
    return (
      <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium capitalize", cls)}>
        {str || "—"}
      </span>
    );
  }

  if (type === "boolean") {
    return (
      <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium",
        value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
        {value ? "Yes" : "No"}
      </span>
    );
  }

  if (type === "id") {
    return (
      <span className="font-mono text-[11px] text-gray-400">
        #{str.length > 8 ? str.slice(0, 8) + "…" : str}
      </span>
    );
  }

  // text (default)
  return (
    <span className="truncate max-w-[180px] block" title={str}>
      {str || <span className="text-gray-300">—</span>}
    </span>
  );
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-t border-gray-100 dark:border-gray-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${50 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function EntityTable({ columns, rows, highlightIds, loading }: Props) {
  const primaryCol = useMemo(() => columns.find((c) => c.primary), [columns]);

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap",
                  col.width
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400 text-sm">
                No data
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => {
              const rowId = row.id ?? row[primaryCol?.key ?? ""] ?? rowIdx;
              const isNew = highlightIds?.has(rowId as string | number) ?? false;
              return (
                <tr
                  key={rowIdx}
                  className={cn(
                    "border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                    isNew && "animate-highlight"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-2.5",
                        col.primary && "font-medium text-gray-900 dark:text-white"
                      )}
                    >
                      <CellValue type={col.type} value={row[col.key]} badges={col.badges} />
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
