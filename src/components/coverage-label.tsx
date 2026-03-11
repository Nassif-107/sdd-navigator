import type { RequirementDetail } from "@/types";

// @req SCD-UI-003
export function CoverageLabel({ requirement }: { requirement: RequirementDetail }) {
  const hasImpl = requirement.annotations.some((a) => a.type === "impl");
  const hasTest = requirement.annotations.some((a) => a.type === "test");

  if (hasImpl && hasTest) {
    return <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">Fully covered</span>;
  }
  if (hasImpl) {
    return <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Needs tests</span>;
  }
  return <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-200">Not implemented</span>;
}
