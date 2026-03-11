import type { Task } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  open: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

// @req SCD-UI-003
export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="text-sm text-foreground/60">No tasks linked.</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-foreground/10 p-3 text-sm">
          <span className="font-mono text-xs">{task.id}</span>
          <span className="flex-1">{task.title}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status] ?? ""}`}>
            {task.status}
          </span>
          {task.assignee && <span className="text-foreground/60">{task.assignee}</span>}
          <span className="text-xs text-foreground/40">{new Date(task.updatedAt).toLocaleDateString()}</span>
        </li>
      ))}
    </ul>
  );
}
