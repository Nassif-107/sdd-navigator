import { Suspense } from "react";
import { TasksPanel } from "@/components/tasks-panel";

// @req SCD-UI-004
export default function TasksPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Tasks</h1>
      <Suspense fallback={<p className="py-8 text-center text-foreground/60" role="status">Loading tasks…</p>}>
        <TasksPanel />
      </Suspense>
    </div>
  );
}
