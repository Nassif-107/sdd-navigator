"use client";

import { useEffect, useState } from "react";
import type { Annotation, Task, ApiError } from "@/types";
import { listAnnotations, listTasks } from "@/lib/api";

// @req SCD-UI-005
export function OrphanPanel() {
  const [annotationOrphans, setAnnotationOrphans] = useState<Annotation[]>([]);
  const [taskOrphans, setTaskOrphans] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const [annResult, taskResult] = await Promise.all([
        listAnnotations({ orphans: true }),
        listTasks({ orphans: true }),
      ]);
      if (cancelled) return;

      if (!annResult.ok) { setError(annResult.error); setLoading(false); return; }
      if (!taskResult.ok) { setError(taskResult.error); setLoading(false); return; }

      setAnnotationOrphans(annResult.data);
      setTaskOrphans(taskResult.data);
      setLoading(false);
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        <p className="font-medium">Error: {error.error}</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (loading) {
    return <p className="py-8 text-center text-foreground/60" role="status">Loading orphans…</p>;
  }

  if (annotationOrphans.length === 0 && taskOrphans.length === 0) {
    return <p className="py-4 text-sm text-foreground/60">No orphans detected.</p>;
  }

  return (
    <div className="space-y-4">
      <CollapsibleSection title={`Annotation Orphans (${annotationOrphans.length})`} defaultOpen={annotationOrphans.length > 0}>
        <ul className="space-y-2">
          {annotationOrphans.map((ann, i) => (
            <li key={`${ann.file}-${ann.line}-${i}`} className="rounded border border-yellow-300 bg-yellow-50 p-3 text-sm dark:border-yellow-800 dark:bg-yellow-950">
              <div className="flex flex-wrap gap-3">
                <span className="font-mono text-xs">{ann.file}:{ann.line}</span>
                <span className="text-foreground/60">reqId: <strong>{ann.reqId}</strong></span>
                <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs">{ann.type}</span>
              </div>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      <CollapsibleSection title={`Task Orphans (${taskOrphans.length})`} defaultOpen={taskOrphans.length > 0}>
        <ul className="space-y-2">
          {taskOrphans.map((task) => (
            <li key={task.id} className="rounded border border-yellow-300 bg-yellow-50 p-3 text-sm dark:border-yellow-800 dark:bg-yellow-950">
              <div className="flex flex-wrap gap-3">
                <span className="font-mono text-xs">{task.id}</span>
                <span>{task.title}</span>
                <span className="text-foreground/60">reqId: <strong>{task.requirementId}</strong></span>
              </div>
            </li>
          ))}
        </ul>
      </CollapsibleSection>
    </div>
  );
}

function CollapsibleSection({ title, defaultOpen, children }: { title: string; defaultOpen: boolean; children: React.ReactNode }) {
  return (
    <details open={defaultOpen || undefined}>
      <summary className="cursor-pointer select-none text-sm font-medium">{title}</summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
