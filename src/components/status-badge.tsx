import type { CoverageStatus } from "@/types";

const STYLES: Record<CoverageStatus, string> = {
  covered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  missing: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

// @req SCD-UI-002
export function StatusBadge({ status }: { status: CoverageStatus }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {status}
    </span>
  );
}
