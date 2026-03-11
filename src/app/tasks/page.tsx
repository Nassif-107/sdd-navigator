import { Suspense } from "react";
import { TasksPanel } from "@/components/tasks-panel";
import { OrphanPanel } from "@/components/orphan-panel";

// @req SCD-UI-004
// @req SCD-UI-005
export default function TasksPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Tasks</h1>
      <Suspense fallback={<p className="py-8 text-center text-foreground/60" role="status">Loading tasks…</p>}>
        <TasksPanel />
      </Suspense>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Orphans</h2>
        <Suspense fallback={<p className="py-4 text-center text-foreground/60" role="status">Loading orphans…</p>}>
          <OrphanPanel />
        </Suspense>
      </section>
    </div>
  );
}
