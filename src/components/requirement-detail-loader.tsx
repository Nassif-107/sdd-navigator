"use client";

import { useEffect, useState } from "react";
import type { RequirementDetail as RequirementDetailType, ApiError } from "@/types";
import { getRequirement } from "@/lib/api";
import { RequirementDetail } from "./requirement-detail";

// @req SCD-UI-003
// @req SCD-ERR-001
export function RequirementDetailLoader({ id }: { id: string }) {
  const [requirement, setRequirement] = useState<RequirementDetailType | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const result = await getRequirement(id);
      if (cancelled) return;
      if (result.ok) {
        setRequirement(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }

    fetchData();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return <p className="py-8 text-center text-foreground/60" role="status">Loading requirement…</p>;
  }

  if (error) {
    return (
      <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        <p className="font-medium">Error: {error.error}</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!requirement) return null;

  return <RequirementDetail requirement={requirement} />;
}
