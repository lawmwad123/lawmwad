"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import type { ColDef, ColType } from "@/lib/vertical-views";
import { cn } from "@/lib/cn";

interface Props {
  columns:      ColDef[];
  rows:         Record<string, unknown>[];
  highlightIds?: Set<string | number>;
  loading?:     boolean;
  primaryKey?:  string;
  onEdit?:      (row: Record<string, unknown>) => void;
  onDelete?:    (rowId: string | number) => Promise<void>;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

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

export function EntityTable({ columns, rows, highlightIds, loading, primaryKey, onEdit, onDelete }: Props) {
  const primaryCol = useMemo(() => columns.find((c) => c.primary), [columns]);
  const hasActions = !!(onEdit || onDelete);

  // Inline delete confirmation state
  const [deletingId,  setDeletingId]  = useState<string | number | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  function getRowId(row: Record<string, unknown>, idx: number): string | number {
    return (row[primaryKey ?? "id"] ?? row[primaryCol?.key ?? ""] ?? idx) as string | number;
  }

  async function confirmDelete(rowId: string | number) {
    if (!onDelete) return;
    setDeletingBusy(true);
    try {
      await onDelete(rowId);
    } finally {
      setDeletingBusy(false);
      setDeletingId(null);
    }
  }

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
            {hasActions && (
              <th className="px-3 py-2.5 w-[72px]" aria-label="Actions" />
            )}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={columns.length + (hasActions ? 1 : 0)} />)
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-4 py-12 text-center text-gray-400 text-sm">
                No data
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => {
              const rowId = getRowId(row, rowIdx);
              const isNew = highlightIds?.has(rowId as string | number) ?? false;
              const isDeleting = deletingId === rowId;

              return (
                <tr
                  key={rowIdx}
                  className={cn(
                    "border-t border-gray-100 dark:border-gray-800 transition-colors group",
                    isNew ? "animate-highlight" : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
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

                  {hasActions && (
                    <td className="px-3 py-2 text-right">
                      {isDeleting ? (
                        /* Inline delete confirmation */
                        <span className="flex items-center justify-end gap-1">
                          <span className="text-[11px] text-red-600 dark:text-red-400 mr-1 whitespace-nowrap">Delete?</span>
                          <button
                            onClick={() => confirmDelete(rowId)}
                            disabled={deletingBusy}
                            className="p-1 rounded text-green-600 hover:bg-green-50 dark:hover:bg-green-950 disabled:opacity-40 transition-colors"
                            title="Confirm delete"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            disabled={deletingBusy}
                            className="p-1 rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ) : (
                        /* Normal hover actions */
                        <span className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="p-1 rounded text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => setDeletingId(rowId)}
                              className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
