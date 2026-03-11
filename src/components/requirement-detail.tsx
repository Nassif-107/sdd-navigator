"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { RequirementDetail as RequirementDetailType } from "@/types";
import { StatusBadge } from "./status-badge";
import { CoverageLabel } from "./coverage-label";
import { AnnotationList } from "./annotation-list";
import { TaskList } from "./task-list";

// @req SCD-UI-003
export function RequirementDetail({ requirement }: { requirement: RequirementDetailType }) {
  const searchParams = useSearchParams();

  const backHref = `/requirements?${searchParams.toString()}`;

  return (
    <div>
      <Link href={backHref} className="mb-4 inline-block text-sm text-foreground/60 hover:underline">
        &larr; Back to requirements
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{requirement.title}</h1>
        <StatusBadge status={requirement.status} />
        <CoverageLabel requirement={requirement} />
      </div>

      <dl className="mb-8 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-foreground/60">ID</dt>
          <dd className="font-mono">{requirement.id}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground/60">Type</dt>
          <dd>{requirement.type}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-medium text-foreground/60">Description</dt>
          <dd>{requirement.description}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground/60">Created</dt>
          <dd>{new Date(requirement.createdAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground/60">Updated</dt>
          <dd>{new Date(requirement.updatedAt).toLocaleString()}</dd>
        </div>
      </dl>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Annotations ({requirement.annotations.length})</h2>
        <AnnotationList annotations={requirement.annotations} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Tasks ({requirement.tasks.length})</h2>
        <TaskList tasks={requirement.tasks} />
      </section>
    </div>
  );
}
