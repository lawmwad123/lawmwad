"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentResult } from "@/lib/types";

function AnimatedNumber({ value }: { value: number | string }) {
  const [display, setDisplay] = useState<number | string>(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const numVal = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    if (isNaN(numVal)) { setDisplay(value); return; }

    const start     = Date.now();
    const duration  = 800;
    const startVal  = 0;

    function tick() {
      const elapsed  = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.round(startVal + (numVal - startVal) * eased);
      setDisplay(current);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  if (typeof value === "string" && isNaN(parseFloat(value))) return <>{value}</>;
  return <>{display.toLocaleString()}</>;
}

export function StatsResult({ result }: { result: AgentResult }) {
  const data = result.data ?? [];
  if (!data.length) return null;

  // Each row is a stat: columns are label/value pairs
  const entries = Object.entries(data[0]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {entries.map(([key, val], i) => {
        const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const numericVal = typeof val === "number" ? val : parseFloat(String(val));
        const isNumeric  = !isNaN(numericVal);

        return (
          <div
            key={key}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 animate-fade-up opacity-0-start"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {isNumeric ? <AnimatedNumber value={numericVal} /> : String(val)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{label}</div>
          </div>
        );
      })}
    </div>
  );
}
