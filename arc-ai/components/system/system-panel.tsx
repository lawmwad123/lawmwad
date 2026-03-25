"use client";

import {
  useState, useEffect, useCallback, useRef,
  forwardRef, useImperativeHandle,
} from "react";
import { RefreshCw, Sparkles, Plus } from "lucide-react";
import type { Session } from "@/lib/types";
import { getViews, buildDynamicViews, type EntityView } from "@/lib/vertical-views";
import { EntityTable } from "./entity-table";
import { RecordDrawer } from "./record-drawer";
import { VERTICAL_ICONS, VERTICAL_COLORS } from "@/lib/vertical-config";
import { cn } from "@/lib/cn";

// ─── Public handle (for parent to call refresh) ────────────────────────────

export interface SystemPanelHandle {
  /** Refresh the current entity — call when AI completes an action. */
  refresh: (actionType?: string) => void;
}

interface Props {
  session:    Session;
  /** Callback fires when user clicks a row context action (like "Ask AI about…") */
  onAiQuery?: (query: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SystemPanel = forwardRef<SystemPanelHandle, Props>(function SystemPanel(
  { session, onAiQuery },
  ref,
) {
  // For custom DB connections use views derived from the actual introspected schema.
  // For named sandbox verticals fall back to the hardcoded vertical views.
  const views = (
    session.vertical === "custom" && session.discovered_entities?.length
      ? buildDynamicViews(session.discovered_entities, session.schema_name)
      : getViews(session.vertical)
  );
  const [activeId, setActiveId]   = useState<string>(views[0]?.id ?? "");
  const [rows,     setRows]       = useState<Record<string, unknown>[]>([]);
  const [loading,  setLoading]    = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [highlightIds, setHighlightIds]   = useState<Set<string | number>>(new Set());
  const [justUpdated,  setJustUpdated]    = useState(false);
  const prevIdsRef = useRef<Set<string | number>>(new Set());

  // CRUD drawer state
  const [drawerMode,  setDrawerMode]  = useState<"create" | "edit" | null>(null);
  const [editingRow,  setEditingRow]  = useState<Record<string, unknown> | null>(null);

  const activeView: EntityView | undefined = views.find((v) => v.id === activeId);

  // ── Fetch entity data ──────────────────────────────────────────────────────

  const fetchData = useCallback(async (view: EntityView | undefined, isRefresh = false) => {
    if (!view) return;
    setLoading(true);
    try {
      const fetchRows = async () => {
        const r = await fetch("/api/data", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ session_id: session.session_id, sql: view.sql }),
        });
        // On 500, retry once after 2.5s (Cloud Run instance may have just woken — pool recovers)
        if (r.status === 500) {
          await new Promise((res) => setTimeout(res, 2500));
          return fetch("/api/data", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ session_id: session.session_id, sql: view.sql }),
          });
        }
        return r;
      };
      const res  = await fetchRows();
      const data = await res.json() as { rows: Record<string, unknown>[] };
      const newRows = data.rows ?? [];

      if (isRefresh) {
        // Compute new / changed row IDs for highlight
        const newIds = new Set<string | number>();
        for (const row of newRows) {
          const id = (row.id ?? row[view.columns[0]?.key]) as string | number;
          if (id !== undefined && !prevIdsRef.current.has(id)) {
            newIds.add(id);
          }
        }
        if (newIds.size > 0) {
          setHighlightIds(newIds);
          setTimeout(() => setHighlightIds(new Set()), 2500);
        }
        setJustUpdated(true);
        setTimeout(() => setJustUpdated(false), 3000);
      }

      // Store current IDs for next diff
      prevIdsRef.current = new Set(
        newRows.map((r) => (r.id ?? r[view.columns[0]?.key]) as string | number)
      );
      setRows(newRows);
      setLastRefreshed(new Date());
    } catch {
      /* silent — keep previous rows */
    } finally {
      setLoading(false);
    }
  }, [session.session_id]);

  // ── CRUD helpers ───────────────────────────────────────────────────────────

  const mutate = useCallback(async (
    operation: "insert" | "update" | "delete",
    data: Record<string, unknown> = {},
    rowId?: string | number,
  ) => {
    if (!activeView?.table) throw new Error("No table configured for this entity.");
    const res = await fetch("/api/data/mutate", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        session_id:  session.session_id,
        operation,
        table:       activeView.table,
        primary_key: activeView.primaryKey ?? "id",
        data,
        where_id:    rowId ?? null,
      }),
    });
    const json = await res.json() as { error?: string };
    if (!res.ok) throw new Error(json.error ?? "Mutation failed.");
    return json;
  }, [session.session_id, activeView]);

  // Initial load + when active entity changes
  useEffect(() => {
    prevIdsRef.current = new Set();
    setHighlightIds(new Set());
    fetchData(activeView);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, session.session_id]);

  // ── Imperative handle ──────────────────────────────────────────────────────

  useImperativeHandle(ref, () => ({
    refresh(actionType?: string) {
      // Only refresh if the current view cares about this action
      if (actionType && activeView && !activeView.refreshOn.includes(actionType)) {
        // Try to switch to the most relevant view for this action
        const relevantView = views.find((v) => v.refreshOn.includes(actionType));
        if (relevantView) {
          setActiveId(relevantView.id);
          return; // useEffect will fetch automatically
        }
      }
      fetchData(activeView, true);
    },
  }), [activeView, fetchData, views]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const colors = VERTICAL_COLORS[session.vertical] ?? VERTICAL_COLORS.custom;
  const icon   = VERTICAL_ICONS[session.vertical]  ?? "🗄️";

  if (views.length === 0) return null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">

      {/* Panel header */}
      <div className={cn(
        "px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2",
        "bg-gray-50 dark:bg-gray-900"
      )}>
        <span className="text-xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {session.org_name}
          </div>
          <div className={cn("text-[10px] font-medium uppercase tracking-wider", colors.text)}>
            Live Data
          </div>
        </div>

        {/* Updated flash badge */}
        {justUpdated && (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium animate-fade-in">
            <Sparkles className="w-3 h-3" />
            Updated
          </span>
        )}

        <button
          onClick={() => fetchData(activeView, true)}
          disabled={loading}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
          title="Refresh data"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
        </button>
      </div>

      {/* Entity nav tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveId(v.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors",
              activeId === v.id
                ? `border-brand-500 text-brand-600 dark:text-brand-400`
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <span>{v.icon}</span>
            {v.label}
          </button>
        ))}
      </div>

      {/* Table area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Table meta bar */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <span className="text-xs text-gray-400">
            {loading ? "Loading…" : `${rows.length} record${rows.length !== 1 ? "s" : ""}`}
          </span>
          <div className="flex items-center gap-2">
            {lastRefreshed && (
              <span className="text-[10px] text-gray-300 dark:text-gray-600">
                {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            {activeView?.editableFields?.length && (
              <button
                onClick={() => { setEditingRow(null); setDrawerMode("create"); }}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-md transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            )}
          </div>
        </div>

        {activeView ? (
          <EntityTable
            columns={activeView.columns}
            rows={rows}
            highlightIds={highlightIds}
            loading={loading}
            primaryKey={activeView.primaryKey}
            onEdit={activeView.editableFields?.length ? (row) => {
              setEditingRow(row);
              setDrawerMode("edit");
            } : undefined}
            onDelete={activeView.editableFields?.length ? async (rowId) => {
              await mutate("delete", {}, rowId);
              fetchData(activeView, true);
            } : undefined}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select an entity
          </div>
        )}
      </div>

      {/* Footer hint */}
      {onAiQuery && (
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <p className="text-[11px] text-gray-400">
            Changes made through the AI assistant appear here in real time.
          </p>
        </div>
      )}

      {/* CRUD drawer */}
      {drawerMode && activeView?.editableFields && (
        <RecordDrawer
          entity={activeView.label}
          mode={drawerMode}
          fields={activeView.editableFields}
          initial={editingRow ?? undefined}
          onSave={async (data) => {
            const pk = activeView.primaryKey ?? "id";
            const rowId = editingRow?.[pk] as string | number | undefined;
            await mutate(drawerMode === "create" ? "insert" : "update", data, rowId);
            fetchData(activeView, true);
          }}
          onClose={() => setDrawerMode(null)}
        />
      )}
    </div>
  );
});
