"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  Loader2,
  Pencil,
  Plug,
  Search,
  Sparkles,
  Table2,
} from "lucide-react";
import Link from "next/link";
import { useSessionStore } from "@/lib/store";
import { VERTICAL_ICONS, VERTICAL_COLORS } from "@/lib/vertical-config";
import type { DiscoveredEntity, Session, Vertical } from "@/lib/types";
import { cn } from "@/lib/cn";

type Tab = "verticals" | "connect";
type ConnectPhase = "idle" | "connecting" | "discovered";

// Vertical-specific icons for discovered entity types
const ENTITY_ICON_MAP: Record<string, string> = {
  patients: "🧑‍⚕️", doctors: "👨‍⚕️", appointments: "📅", wards: "🏥",
  prescriptions: "💊", bills: "🧾", staff: "👥", users: "👤",
  orders: "📦", products: "🛍️", customers: "👥", reviews: "⭐",
  employees: "👤", departments: "🏢", payroll: "💰", leave: "🌴",
  accounts: "🏦", loans: "💳", transactions: "💸", members: "👤",
  beneficiaries: "🤲", projects: "📋", distributions: "📬", donors: "❤️",
  students: "🎓", teachers: "👨‍🏫", classes: "🏫", subjects: "📚",
};

function getEntityIcon(entityName: string): string {
  const lower = entityName.toLowerCase();
  for (const [key, icon] of Object.entries(ENTITY_ICON_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return "📊";
}

function formatRowCount(n: number): string {
  if (n === 0) return "";
  if (n >= 1000) return `~${Math.round(n / 1000)}k rows`;
  return `${n} rows`;
}

// ── Discovery Panel ──────────────────────────────────────────────────────────

interface DiscoveryPanelProps {
  session: Session;
  onStart: () => void;
  onOrgNameChange: (name: string) => void;
}

function DiscoveryPanel({ session, onStart, onOrgNameChange }: DiscoveryPanelProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue,   setNameValue]   = useState(session.org_name);
  const entities     = session.discovered_entities ?? [];
  const queries      = session.suggested_queries ?? [];
  const summary      = session.capabilities_summary ?? "";

  function commitName() {
    setEditingName(false);
    if (nameValue.trim()) onOrgNameChange(nameValue.trim());
  }

  return (
    <div className="space-y-8">

      {/* ── Header row ── */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">
            Connected — schema learned in seconds
          </p>

          {/* Editable org name */}
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onBlur={commitName}
                onKeyDown={(e) => { if (e.key === "Enter") commitName(); if (e.key === "Escape") setEditingName(false); }}
                className="text-2xl font-bold bg-transparent border-b-2 border-brand-500 outline-none text-gray-900 dark:text-white w-full"
              />
            </div>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="group flex items-center gap-2 text-left"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {nameValue}
              </h2>
              <Pencil className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          {summary && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
              {summary}
            </p>
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Table2 className="w-4 h-4" />
          <span><strong className="text-gray-900 dark:text-white">{session.entity_count}</strong> tables discovered</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Database className="w-4 h-4" />
          <span>Schema: <strong className="text-gray-900 dark:text-white font-mono">{session.schema_name}</strong></span>
        </div>
        {session.actions_enabled && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Actions enabled</span>
          </div>
        )}
      </div>

      {/* ── Entity cards ── */}
      {entities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
            What I understand about your data
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {entities.slice(0, 12).map((entity) => (
              <EntityCard key={entity.entity_name} entity={entity} />
            ))}
          </div>
          {entities.length > 12 && (
            <p className="mt-2 text-xs text-gray-400">
              +{entities.length - 12} more tables available
            </p>
          )}
        </div>
      )}

      {/* ── Suggested queries ── */}
      {queries.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            Questions you can ask right now
          </h3>
          <div className="flex flex-wrap gap-2">
            {queries.map((q, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-700"
              >
                {q}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <button
        onClick={onStart}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
      >
        Start Chatting with your data
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function EntityCard({ entity }: { entity: DiscoveredEntity }) {
  const icon     = getEntityIcon(entity.entity_name);
  const rowLabel = formatRowCount(entity.row_count);
  const question = entity.sample_questions[0] ?? null;

  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-3">
      <div className="flex-shrink-0 text-xl">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {entity.display_name}
          </span>
          {rowLabel && (
            <span className="flex-shrink-0 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">
              {rowLabel}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1.5">
          {entity.description}
        </p>
        {question && (
          <p className="text-xs text-brand-600 dark:text-brand-400 italic line-clamp-1">
            e.g. "{question}"
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main OnboardingHub ───────────────────────────────────────────────────────

export function OnboardingHub() {
  const router       = useRouter();
  const params       = useSearchParams();
  const { setSession } = useSessionStore();

  const initialVertical = params.get("vertical") ?? "";
  const initialTab      = (params.get("tab") as Tab) ?? "verticals";

  const [tab,          setTab]          = useState<Tab>(initialTab);
  const [verticals,    setVerticals]    = useState<Vertical[]>([]);
  const [selected,     setSelected]     = useState<string>(initialVertical);
  const [loading,      setLoading]      = useState(false);
  const [loadingVerts, setLoadingVerts] = useState(true);
  const [connStr,      setConnStr]      = useState("");
  const [error,        setError]        = useState("");
  // Custom DB connect state
  const [connectPhase, setConnectPhase] = useState<ConnectPhase>("idle");
  const [discovered,   setDiscovered]   = useState<Session | null>(null);

  useEffect(() => {
    fetch("/api/verticals")
      .then((r) => r.json())
      .then((d) => setVerticals(d.verticals ?? []))
      .catch(() => setError("Could not load verticals"))
      .finally(() => setLoadingVerts(false));
  }, []);

  async function startSandbox(verticalId: string) {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/session", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ vertical: verticalId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create session");
      setSession(data);
      router.push(`/chat/${data.session_id}`);
    } catch (e) {
      setError(String(e));
      setLoading(false);
    }
  }

  async function connectCustom() {
    if (!connStr.trim()) return;
    setConnectPhase("connecting");
    setError("");
    try {
      const res  = await fetch("/api/session", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ connection_string: connStr }),
      });
      const data: Session = await res.json();
      if (!res.ok) throw new Error((data as any).error ?? "Failed to connect");
      setSession(data);
      setDiscovered(data);
      setConnectPhase("discovered");
    } catch (e) {
      setError(String(e));
      setConnectPhase("idle");
    }
  }

  function handleOrgNameChange(name: string) {
    if (!discovered) return;
    const updated = { ...discovered, org_name: name };
    setDiscovered(updated);
    setSession(updated);
  }

  function startChatting() {
    if (discovered) router.push(`/chat/${discovered.session_id}`);
  }

  function resetConnect() {
    setConnectPhase("idle");
    setDiscovered(null);
    setConnStr("");
    setError("");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit mb-8">
          <button
            onClick={() => { setTab("verticals"); resetConnect(); }}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-medium transition-colors",
              tab === "verticals"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            Pre-loaded Demos
          </button>
          <button
            onClick={() => setTab("connect")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
              tab === "connect"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <Plug className="w-3.5 h-3.5" /> Connect your DB
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* ── Pre-loaded Demos tab ── */}
        {tab === "verticals" && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Choose a vertical
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Each vertical has realistic pre-seeded data with interesting scenarios to explore.
            </p>

            {loadingVerts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {verticals.map((v) => {
                  const colors = VERTICAL_COLORS[v.id] ?? VERTICAL_COLORS.custom;
                  const icon   = VERTICAL_ICONS[v.id]  ?? "🗄️";
                  const isSel  = selected === v.id;
                  return (
                    <button
                      key={v.id}
                      disabled={loading}
                      onClick={() => { setSelected(v.id); startSandbox(v.id); }}
                      className={cn(
                        "text-left p-6 rounded-2xl border-2 transition-all",
                        isSel
                          ? `${colors.bg} ${colors.border} ring-2 ring-brand-500 ring-offset-2`
                          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                    >
                      <div className="text-3xl mb-3">{icon}</div>
                      <div className={cn("font-semibold text-lg mb-1", isSel ? colors.text : "text-gray-900 dark:text-white")}>
                        {v.display}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                        {v.description}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {v.sample_queries.slice(0, 2).map((q, qi) => (
                          <span key={qi} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md line-clamp-1 max-w-[140px] truncate">
                            {q}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {loading && (
              <div className="mt-8 flex justify-center items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing demo...
              </div>
            )}
          </>
        )}

        {/* ── Connect your DB tab ── */}
        {tab === "connect" && (
          <div className="max-w-2xl">
            {connectPhase === "discovered" && discovered ? (
              /* ── Discovery panel ── */
              <DiscoveryPanel
                session={discovered}
                onStart={startChatting}
                onOrgNameChange={handleOrgNameChange}
              />
            ) : (
              /* ── Connection form ── */
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Connect your database
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  Point DataMind at your own Postgres database. The AI will auto-discover your
                  schema and show you exactly what it understands before you start chatting.
                </p>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Postgres Connection String
                    </label>
                    <input
                      type="text"
                      value={connStr}
                      onChange={(e) => setConnStr(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") connectCustom(); }}
                      placeholder="postgresql://user:password@host:5432/dbname"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <p className="mt-1.5 text-xs text-gray-400">
                      Only read-only queries are allowed unless actions are explicitly enabled.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <span className="text-amber-500 text-xl flex-shrink-0">⚠️</span>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Demo environment — do not connect production databases with sensitive data.
                      Your connection string is used only for this session and is not stored.
                    </p>
                  </div>

                  <button
                    disabled={!connStr.trim() || connectPhase === "connecting"}
                    onClick={connectCustom}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors",
                      connStr.trim() && connectPhase !== "connecting"
                        ? "bg-brand-600 hover:bg-brand-700 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    {connectPhase === "connecting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting & learning your schema…</span>
                      </>
                    ) : (
                      <>
                        <Plug className="w-4 h-4" />
                        Connect Database
                      </>
                    )}
                  </button>

                  {connectPhase === "connecting" && (
                    <div className="space-y-2 pt-1">
                      <ConnectingStep label="Opening connection pool" done />
                      <ConnectingStep label="Introspecting tables, columns & foreign keys" animated />
                      <ConnectingStep label="AI is learning your schema…" pending />
                      <ConnectingStep label="Deriving organisation identity" pending />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small helper for the connecting progress indicator ─────────────────────

function ConnectingStep({
  label,
  done,
  animated,
  pending,
}: {
  label: string;
  done?: boolean;
  animated?: boolean;
  pending?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
      {done ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
      ) : animated ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500 flex-shrink-0" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0" />
      )}
      <span className={cn(done && "line-through opacity-50", pending && "opacity-40")}>
        {label}
      </span>
    </div>
  );
}
