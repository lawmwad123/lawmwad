"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { AgentResult } from "@/lib/types";
import { cn } from "@/lib/cn";

const STATUS_COLORS: Record<string, string> = {
  active:    "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  inactive:  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  pending:   "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  suspended: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  overdue:   "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  planning:  "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  flagged:   "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  frozen:    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  dormant:   "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

function CellValue({ value, colType }: { value: unknown; colType?: string }) {
  const str = value == null ? "—" : String(value);

  if (colType === "badge" || colType === "status") {
    const key = str.toLowerCase();
    const cls = STATUS_COLORS[key] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    return <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium", cls)}>{str}</span>;
  }

  if (colType === "currency" || colType === "currency_ugx") {
    const num = parseFloat(str.replace(/[^0-9.-]/g, ""));
    if (!isNaN(num)) {
      return <span className="font-mono text-xs">{num.toLocaleString()}</span>;
    }
  }

  if (colType === "boolean") {
    return value
      ? <span className="text-green-600 dark:text-green-400 text-xs font-medium">Yes</span>
      : <span className="text-gray-400 text-xs">No</span>;
  }

  if (colType === "phone") {
    return <span className="font-mono text-xs">{str}</span>;
  }

  return <span className="text-xs">{str}</span>;
}

export function TableResult({ result }: { result: AgentResult }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const data = result.data ?? [];

  const colTypes = result.display_metadata?.column_types ?? {};

  const columns: ColumnDef<Record<string, unknown>>[] = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      cell: ({ getValue }) => (
        <CellValue value={getValue()} colType={colTypes[key]} />
      ),
    }));
  }, [data, colTypes]);

  const table = useReactTable({
    data,
    columns,
    state:              { sorting },
    onSortingChange:    setSorting,
    getCoreRowModel:    getCoreRowModel(),
    getSortedRowModel:  getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (!data.length) return <div className="text-sm text-gray-400 italic">No results</div>;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
      {/* Row count */}
      {result.row_count != null && (
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
          {result.row_count.toLocaleString()} row{result.row_count !== 1 ? "s" : ""}
          {result.row_count > data.length ? ` (showing ${data.length})` : ""}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer select-none whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        header.column.getIsSorted() === "asc"  ? <ChevronUp className="w-3 h-3" />
                        : header.column.getIsSorted() === "desc" ? <ChevronDown className="w-3 h-3" />
                        : <ChevronsUpDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={cn(
                  "border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                  i % 2 === 0 ? "" : "bg-gray-50/30 dark:bg-gray-900/30"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
          <div className="flex gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
