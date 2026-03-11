"use client";

import { useEffect, useState, useCallback } from "react";
import type { Task, ApiError } from "@/types";
import { listTasks, listRequirements } from "@/lib/api";
import { FilterChips } from "./filter-chips";

const STATUS_OPTIONS = ["open", "in_progress", "done"] as const;

const STATUS_STYLES: Record<string, string> = {
  done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  open: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

// @req SCD-UI-004
export function TasksPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [validReqIds, setValidReqIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<("open" | "in_progress" | "done")[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const [tasksResult, reqsResult] = await Promise.all([
        listTasks(),
        listRequirements(),
      ]);
      if (cancelled) return;

      if (!tasksResult.ok) { setError(tasksResult.error); setLoading(false); return; }
      if (!reqsResult.ok) { setError(reqsResult.error); setLoading(false); return; }

      setTasks(tasksResult.data);
      setValidReqIds(new Set(reqsResult.data.map((r) => r.id)));
      setLoading(false);
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  const toggleStatus = useCallback((value: "open" | "in_progress" | "done") => {
    setStatusFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  const filtered = statusFilter.length > 0
    ? tasks.filter((t) => statusFilter.includes(t.status))
    : tasks;

  if (error) {
    return (
      <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        <p className="font-medium">Error: {error.error}</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <FilterChips label="Status" options={STATUS_OPTIONS} selected={statusFilter} onToggle={toggleStatus} />
      </div>

      {loading ? (
        <p className="py-8 text-center text-foreground/60" role="status">Loading tasks…</p>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-foreground/60">No tasks match the current filter.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground/10">
                  <th className="px-4 py-2 text-left font-medium">ID</th>
                  <th className="px-4 py-2 text-left font-medium">Requirement</th>
                  <th className="px-4 py-2 text-left font-medium">Title</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">Assignee</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((task) => {
                  const isOrphan = !validReqIds.has(task.requirementId);
                  return (
                    <tr
                      key={task.id}
                      className={`border-b border-foreground/5 ${isOrphan ? "bg-yellow-50 dark:bg-yellow-950" : ""}`}
                    >
                      <td className="px-4 py-2 font-mono text-xs">{task.id}</td>
                      <td className="px-4 py-2 font-mono text-xs">
                        {task.requirementId}
                        {isOrphan && <span className="ml-1 text-yellow-600" aria-label="orphan">&#9888;</span>}
                      </td>
                      <td className="px-4 py-2">{task.title}</td>
                      <td className="px-4 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status] ?? ""}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-foreground/60">{task.assignee ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filtered.map((task) => {
              const isOrphan = !validReqIds.has(task.requirementId);
              return (
                <div
                  key={task.id}
                  className={`rounded-lg border border-foreground/10 p-4 ${isOrphan ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{task.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status] ?? ""}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="mt-1 font-medium">{task.title}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-foreground/60">
                    <span>
                      {task.requirementId}
                      {isOrphan && <span className="ml-1 text-yellow-600" aria-label="orphan">&#9888;</span>}
                    </span>
                    <span>{task.assignee ?? "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
