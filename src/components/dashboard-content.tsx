"use client";

import type { Stats, ApiError } from "@/types";
import type { ApiResult } from "@/lib/api";
import { SummaryPanel } from "./summary-panel";
import { ScanButton } from "./scan-button";

// @req SCD-UI-001
// @req SCD-ERR-001
export function DashboardContent({ result }: { result: ApiResult<Stats> }) {
  if (!result.ok) {
    return <ErrorMessage error={result.error} />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <ScanButton />
      </div>
      <SummaryPanel stats={result.data} />
    </div>
  );
}

function ErrorMessage({ error }: { error: ApiError }) {
  return (
    <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
      <p className="font-medium">Error: {error.error}</p>
      <p className="text-sm">{error.message}</p>
    </div>
  );
}
