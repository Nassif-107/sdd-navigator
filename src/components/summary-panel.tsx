"use client";

import type { Stats } from "@/types";

// @req SCD-UI-001
export function SummaryPanel({ stats }: { stats: Stats }) {
  const { requirements, annotations, tasks, coverage, lastScanAt } = stats;

  return (
    <section aria-label="Project summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Requirements" value={requirements.total}>
        <TypeBreakdown fr={requirements.byType.FR} ar={requirements.byType.AR} />
      </Card>

      <Card title="Coverage" value={`${coverage}%`}>
        <ProgressBar percent={coverage} />
      </Card>

      <Card title="Status Breakdown">
        <StatusBars byStatus={requirements.byStatus} total={requirements.total} />
      </Card>

      <Card title="Orphans">
        <OrphanWarnings annotationOrphans={annotations.orphans} taskOrphans={tasks.orphans} />
      </Card>

      <div className="sm:col-span-2 lg:col-span-4 text-sm text-foreground/60">
        Last scan: {new Date(lastScanAt).toLocaleString()}
      </div>
    </section>
  );
}

function Card({ title, value, children }: { title: string; value?: string | number; children?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-foreground/10 p-4">
      <h3 className="text-sm font-medium text-foreground/60">{title}</h3>
      {value !== undefined && <p className="mt-1 text-2xl font-semibold">{value}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

function TypeBreakdown({ fr, ar }: { fr: number; ar: number }) {
  return (
    <div className="flex gap-4 text-sm">
      <span>FR: <strong>{fr}</strong></span>
      <span>AR: <strong>{ar}</strong></span>
    </div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-foreground/10" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="h-full rounded-full bg-green-500 transition-all"
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

function StatusBars({ byStatus, total }: { byStatus: Record<string, number>; total: number }) {
  const items: { label: string; count: number; color: string }[] = [
    { label: "Covered", count: byStatus.covered ?? 0, color: "bg-green-500" },
    { label: "Partial", count: byStatus.partial ?? 0, color: "bg-yellow-500" },
    { label: "Missing", count: byStatus.missing ?? 0, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-1.5">
      {items.map(({ label, count, color }) => (
        <div key={label} className="flex items-center gap-2 text-sm">
          <span className="w-16">{label}</span>
          <div className="h-2 flex-1 rounded-full bg-foreground/10">
            <div
              className={`h-full rounded-full ${color} transition-all`}
              style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
            />
          </div>
          <span className="w-6 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
}

function OrphanWarnings({ annotationOrphans, taskOrphans }: { annotationOrphans: number; taskOrphans: number }) {
  const hasOrphans = annotationOrphans > 0 || taskOrphans > 0;

  return (
    <div className="space-y-1 text-sm">
      <div className={annotationOrphans > 0 ? "text-yellow-600" : ""}>
        {annotationOrphans > 0 && <span aria-label="warning">&#9888; </span>}
        Annotation orphans: <strong>{annotationOrphans}</strong>
      </div>
      <div className={taskOrphans > 0 ? "text-yellow-600" : ""}>
        {taskOrphans > 0 && <span aria-label="warning">&#9888; </span>}
        Task orphans: <strong>{taskOrphans}</strong>
      </div>
      {!hasOrphans && <div className="text-green-600">No orphans detected</div>}
    </div>
  );
}
