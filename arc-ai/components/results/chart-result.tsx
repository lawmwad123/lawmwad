"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import type { AgentResult } from "@/lib/types";

const COLORS = ["#6371f1", "#8196f8", "#a5bbfc", "#4f52e5", "#303082", "#c7d7fe", "#3535a3"];

interface Props { result: AgentResult }

function formatValue(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000)     return `${(val / 1_000).toFixed(1)}K`;
  return val.toLocaleString();
}

export function ChartResult({ result }: Props) {
  const data      = result.data ?? [];
  const chartType = result.chart_type ?? "bar";

  if (!data.length) return null;

  const keys    = Object.keys(data[0]);
  const xKey    = keys[0];
  const valueKeys = keys.slice(1).filter((k) => typeof data[0][k] === "number" || !isNaN(parseFloat(String(data[0][k]))));

  const normalized = data.map((row) => {
    const out: Record<string, unknown> = { [xKey]: row[xKey] };
    for (const k of valueKeys) {
      out[k] = typeof row[k] === "number" ? row[k] : parseFloat(String(row[k]));
    }
    return out;
  });

  const valueKey = valueKeys[0] ?? "value";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
      {result.suggested_title && (
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {result.suggested_title}
        </div>
      )}

      {chartType === "bar" && (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={normalized} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "currentColor" }}
              angle={-35}
              textAnchor="end"
              interval={0}
              className="text-gray-500 dark:text-gray-400"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "currentColor" }}
              tickFormatter={formatValue}
              className="text-gray-500 dark:text-gray-400"
            />
            <Tooltip
              formatter={(v: number) => [v.toLocaleString(), ""]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
            {valueKeys.map((k, i) => (
              <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} maxBarSize={48} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}

      {chartType === "pie" && (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={normalized}
              dataKey={valueKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {normalized.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => v.toLocaleString()}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}

      {chartType === "line" && (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={normalized} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "currentColor" }}
              angle={-35}
              textAnchor="end"
              interval={0}
              className="text-gray-500 dark:text-gray-400"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "currentColor" }}
              tickFormatter={formatValue}
              className="text-gray-500 dark:text-gray-400"
            />
            <Tooltip
              formatter={(v: number) => v.toLocaleString()}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            {valueKeys.map((k, i) => (
              <Line key={k} dataKey={k} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}

      {chartType === "progress" && (
        <div className="space-y-3">
          {normalized.map((row, i) => {
            const label = String(row[xKey]);
            const val   = row[valueKey] as number;
            const max   = Math.max(...normalized.map((r) => r[valueKey] as number));
            const pct   = max > 0 ? (val / max) * 100 : 0;
            return (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
                  <span className="text-gray-500 dark:text-gray-400">{val.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full animate-bar-grow origin-left"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                      animationDelay: `${i * 50}ms`,
                      animationFillMode: "backwards",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {chartType === "distribution" && result.display_metadata?.distributions && (
        <div className="space-y-4">
          {result.display_metadata.distributions.map((dist) => (
            <div key={dist.column}>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 capitalize">
                {dist.column.replace(/_/g, " ")}
              </div>
              <div className="space-y-1.5">
                {dist.distribution.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-24 truncate">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{item.pct.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
