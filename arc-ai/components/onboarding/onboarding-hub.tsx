"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Plug } from "lucide-react";
import Link from "next/link";
import { useSessionStore } from "@/lib/store";
import { VERTICAL_ICONS, VERTICAL_COLORS } from "@/lib/vertical-config";
import type { Vertical } from "@/lib/types";
import { cn } from "@/lib/cn";

type Tab = "verticals" | "connect";

export function OnboardingHub() {
  const router       = useRouter();
  const params       = useSearchParams();
  const { setSession } = useSessionStore();

  const initialVertical = params.get("vertical") ?? "";
  const initialTab      = (params.get("tab") as Tab) ?? "verticals";

  const [tab,         setTab]         = useState<Tab>(initialTab);
  const [verticals,   setVerticals]   = useState<Vertical[]>([]);
  const [selected,    setSelected]    = useState<string>(initialVertical);
  const [loading,     setLoading]     = useState(false);
  const [loadingVerts,setLoadingVerts]= useState(true);
  const [connStr,     setConnStr]     = useState("");
  const [error,       setError]       = useState("");

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
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/session", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ connection_string: connStr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to connect");
      setSession(data);
      router.push(`/chat/${data.session_id}`);
    } catch (e) {
      setError(String(e));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-semibold text-gray-900 dark:text-white">Start a Demo Session</h1>
          <p className="text-xs text-gray-500">Pick a pre-loaded vertical or connect your own database</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit mb-8">
          <button
            onClick={() => setTab("verticals")}
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
                  const colors  = VERTICAL_COLORS[v.id] ?? VERTICAL_COLORS.custom;
                  const icon    = VERTICAL_ICONS[v.id]  ?? "🗄️";
                  const isSel   = selected === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelected(isSel ? "" : v.id)}
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

            <div className="mt-8 flex justify-end">
              <button
                disabled={!selected || loading}
                onClick={() => startSandbox(selected)}
                className={cn(
                  "flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-base transition-colors",
                  selected && !loading
                    ? "bg-brand-600 hover:bg-brand-700 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                )}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Preparing demo..." : "Start Demo →"}
              </button>
            </div>
          </>
        )}

        {tab === "connect" && (
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Connect your database
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Point DataMind at your own Postgres database. The AI will auto-discover your schema and be ready to answer questions in seconds.
            </p>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Postgres Connection String
              </label>
              <input
                type="text"
                value={connStr}
                onChange={(e) => setConnStr(e.target.value)}
                placeholder="postgresql://user:password@host:5432/dbname"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="mt-2 text-xs text-gray-400">
                Only read-only queries are allowed unless actions are explicitly enabled.
              </p>

              <div className="mt-6 flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl">
                <span className="text-amber-500 text-xl">⚠️</span>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  This is a demo environment. Do not connect production databases with sensitive data.
                  Your connection string is used only for this session and not stored.
                </p>
              </div>

              <button
                disabled={!connStr.trim() || loading}
                onClick={connectCustom}
                className={cn(
                  "mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors",
                  connStr.trim() && !loading
                    ? "bg-brand-600 hover:bg-brand-700 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                )}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plug className="w-4 h-4" />}
                {loading ? "Connecting & learning schema..." : "Connect Database"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
