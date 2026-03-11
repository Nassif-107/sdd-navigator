import type { Annotation } from "@/types";

// @req SCD-UI-003
export function AnnotationList({ annotations }: { annotations: Annotation[] }) {
  if (annotations.length === 0) {
    return <p className="text-sm text-foreground/60">No annotations linked.</p>;
  }

  return (
    <ul className="space-y-3">
      {annotations.map((ann, i) => (
        <li key={`${ann.file}-${ann.line}-${i}`} className="rounded-lg border border-foreground/10 p-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-mono text-xs">{ann.file}:{ann.line}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              ann.type === "impl"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            }`}>
              {ann.type}
            </span>
          </div>
          <pre className="mt-2 overflow-x-auto rounded bg-foreground/5 p-2 text-xs">{ann.snippet}</pre>
        </li>
      ))}
    </ul>
  );
}
