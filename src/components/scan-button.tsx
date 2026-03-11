"use client";

import { useEffect, useState, useCallback } from "react";
import type { ScanState, ApiError } from "@/types";
import { triggerScan, getScanStatus } from "@/lib/api";

const STATUS_STYLES: Record<ScanState, string> = {
  idle: "text-foreground/60",
  scanning: "text-blue-600 dark:text-blue-400",
  completed: "text-green-600 dark:text-green-400",
  failed: "text-red-600 dark:text-red-400",
};

// @req SCD-API-006
export function ScanButton() {
  const [status, setStatus] = useState<ScanState>("idle");
  const [error, setError] = useState<ApiError | null>(null);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      const result = await getScanStatus();
      if (cancelled) return;
      if (result.ok) setStatus(result.data.status);
    }

    fetchStatus();
    return () => { cancelled = true; };
  }, []);

  const handleTrigger = useCallback(async () => {
    setTriggering(true);
    setError(null);
    const result = await triggerScan();
    if (result.ok) {
      setStatus(result.data.status);
    } else {
      setError(result.error);
    }
    setTriggering(false);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleTrigger}
        disabled={triggering || status === "scanning"}
        className="rounded-md border border-foreground/20 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {triggering ? "Triggering…" : "Run Scan"}
      </button>
      <span className={`text-sm font-medium ${STATUS_STYLES[status]}`}>
        {status}
      </span>
      {error && (
        <span className="text-sm text-red-600 dark:text-red-400">{error.message}</span>
      )}
    </div>
  );
}
