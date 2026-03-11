import { Suspense } from "react";
import { RequirementsTable } from "@/components/requirements-table";

// @req SCD-UI-002
export default function RequirementsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Requirements</h1>
      <Suspense fallback={<p className="py-8 text-center text-foreground/60" role="status">Loading requirements…</p>}>
        <RequirementsTable />
      </Suspense>
    </div>
  );
}
