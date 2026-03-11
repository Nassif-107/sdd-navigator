"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Requirement, ApiError } from "@/types";
import { listRequirements } from "@/lib/api";
import type { RequirementFilters } from "@/lib/api";
import { FilterChips } from "./filter-chips";
import { SortToggle } from "./sort-toggle";
import { StatusBadge } from "./status-badge";

const TYPE_OPTIONS = ["FR", "AR"] as const;
const STATUS_OPTIONS = ["covered", "partial", "missing"] as const;

// @req SCD-UI-002
// @req SCD-UI-007
// @req SCD-ACC-001
export function RequirementsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const typeFilters = searchParams.getAll("type").filter(Boolean) as ("FR" | "AR")[];
  const statusFilters = searchParams.getAll("status").filter(Boolean) as ("covered" | "partial" | "missing")[];
  const sort = (searchParams.get("sort") as "id" | "updatedAt") ?? "id";
  const order = (searchParams.get("order") as "asc" | "desc") ?? "asc";

  const updateParams = useCallback(
    (updates: Record<string, string[]>) => {
      const params = new URLSearchParams();
      for (const [key, values] of Object.entries(updates)) {
        for (const v of values) params.append(key, v);
      }
      if (!updates.sort) params.set("sort", sort);
      if (!updates.order) params.set("order", order);
      if (!updates.type) typeFilters.forEach((t) => { if (t) params.append("type", t); });
      if (!updates.status) statusFilters.forEach((s) => { if (s) params.append("status", s); });
      router.push(`/requirements?${params.toString()}`);
    },
    [router, sort, order, typeFilters, statusFilters],
  );

  const toggleFilter = useCallback(
    (key: "type" | "status", value: string) => {
      const current = key === "type" ? typeFilters : statusFilters;
      const next = current.includes(value as never)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updateParams({ [key]: next as string[] });
    },
    [typeFilters, statusFilters, updateParams],
  );

  const handleSort = useCallback(
    (field: string) => {
      const newOrder = sort === field && order === "asc" ? "desc" : "asc";
      updateParams({ sort: [field], order: [newOrder] });
    },
    [sort, order, updateParams],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function fetchData() {
      const filters: RequirementFilters = {
        type: typeFilters.length === 1 ? typeFilters[0] : undefined,
        status: statusFilters.length === 1 ? statusFilters[0] : undefined,
        sort,
        order,
      };
      const result = await listRequirements(filters);
      if (cancelled) return;
      if (result.ok) {
        let items = result.data;
        if (typeFilters.length > 1) {
          items = items.filter((r) => typeFilters.includes(r.type));
        }
        if (statusFilters.length > 1) {
          items = items.filter((r) => statusFilters.includes(r.status));
        }
        setRequirements(items);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }

    fetchData();
    return () => { cancelled = true; };
  }, [searchParams]);

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
      <div className="mb-4 flex flex-wrap gap-4">
        <FilterChips label="Type" options={TYPE_OPTIONS} selected={typeFilters} onToggle={(v) => toggleFilter("type", v)} />
        <FilterChips label="Status" options={STATUS_OPTIONS} selected={statusFilters} onToggle={(v) => toggleFilter("status", v)} />
      </div>

      {loading ? (
        <p className="py-8 text-center text-foreground/60" role="status">Loading requirements…</p>
      ) : requirements.length === 0 ? (
        <p className="py-8 text-center text-foreground/60">No requirements match the current filters.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <table className="w-full text-sm" role="grid">
              <thead>
                <tr className="border-b border-foreground/10">
                  <SortToggle field="id" currentSort={sort} currentOrder={order} onSort={handleSort}>ID</SortToggle>
                  <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Title</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                  <SortToggle field="updatedAt" currentSort={sort} currentOrder={order} onSort={handleSort}>Updated</SortToggle>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req) => (
                  <tr
                    key={req.id}
                    tabIndex={0}
                    role="row"
                    onClick={() => router.push(`/requirements/${encodeURIComponent(req.id)}?${searchParams.toString()}`)}
                    onKeyDown={(e) => { if (e.key === "Enter") router.push(`/requirements/${encodeURIComponent(req.id)}?${searchParams.toString()}`); }}
                    className="cursor-pointer border-b border-foreground/5 transition-colors hover:bg-foreground/5"
                  >
                    <td className="px-4 py-2 font-mono text-xs">{req.id}</td>
                    <td className="px-4 py-2">{req.type}</td>
                    <td className="px-4 py-2">{req.title}</td>
                    <td className="px-4 py-2"><StatusBadge status={req.status} /></td>
                    <td className="px-4 py-2 text-foreground/60">{new Date(req.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {requirements.map((req) => (
              <button
                key={req.id}
                onClick={() => router.push(`/requirements/${encodeURIComponent(req.id)}?${searchParams.toString()}`)}
                className="rounded-lg border border-foreground/10 p-4 text-left transition-colors hover:bg-foreground/5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">{req.id}</span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="mt-1 font-medium">{req.title}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-foreground/60">
                  <span>{req.type}</span>
                  <span>{new Date(req.updatedAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
