import type {
  Stats,
  Requirement,
  RequirementDetail,
  Annotation,
  Task,
  ScanStatus,
  ApiError,
  RequirementType,
  CoverageStatus,
  AnnotationType,
  TaskStatus,
} from "@/types";

// --- Filter types ---

export interface RequirementFilters {
  type?: RequirementType;
  status?: CoverageStatus;
  sort?: "id" | "updatedAt";
  order?: "asc" | "desc";
}

export interface AnnotationFilters {
  type?: AnnotationType;
  orphans?: boolean;
}

export interface TaskFilters {
  status?: TaskStatus;
  orphans?: boolean;
  sort?: "id" | "updatedAt";
  order?: "asc" | "desc";
}

// --- Result type ---

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

// --- Internals ---

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// @req SCD-ERR-001
function buildUrl(path: string, params?: Record<string, string | boolean | undefined>): string {
  const url = new URL(path, API_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function fetchApi<T>(path: string, params?: Record<string, string | boolean | undefined>, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(buildUrl(path, params), init);
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "unknown", message: res.statusText })) as ApiError;
      return { ok: false, error: body };
    }
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      error: {
        error: "network_error",
        message: err instanceof Error ? err.message : "Unknown network error",
      },
    };
  }
}

async function loadMock<T>(loader: () => Promise<T>): Promise<ApiResult<T>> {
  try {
    const data = await loader();
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      error: { error: "mock_error", message: "Failed to load mock data" },
    };
  }
}

// --- Public API ---

// @req SCD-API-001
export async function getStats(): Promise<ApiResult<Stats>> {
  if (API_URL) return fetchApi<Stats>("/stats");
  return loadMock(async () => {
    const mod = await import("@/data/stats.json");
    return mod.default as Stats;
  });
}

// @req SCD-API-002
export async function listRequirements(filters?: RequirementFilters): Promise<ApiResult<Requirement[]>> {
  if (API_URL) {
    return fetchApi<Requirement[]>("/requirements", {
      type: filters?.type,
      status: filters?.status,
      sort: filters?.sort,
      order: filters?.order,
    });
  }
  return loadMock(async () => {
    const mod = await import("@/data/requirements.json");
    let items = mod.default as Requirement[];
    if (filters?.type) items = items.filter((r) => r.type === filters.type);
    if (filters?.status) items = items.filter((r) => r.status === filters.status);
    const sort = filters?.sort ?? "id";
    const order = filters?.order ?? "asc";
    items = [...items].sort((a, b) => {
      const cmp = sort === "id" ? a.id.localeCompare(b.id) : a.updatedAt.localeCompare(b.updatedAt);
      return order === "asc" ? cmp : -cmp;
    });
    return items;
  });
}

// @req SCD-API-003
export async function getRequirement(id: string): Promise<ApiResult<RequirementDetail>> {
  if (API_URL) return fetchApi<RequirementDetail>(`/requirements/${encodeURIComponent(id)}`);
  return loadMock(async () => {
    const reqMod = await import("@/data/requirements.json");
    const req = (reqMod.default as Requirement[]).find((r) => r.id === id);
    if (!req) {
      throw new Error(`Requirement ${id} not found`);
    }
    const annMod = await import("@/data/annotations.json");
    const annotations = (annMod.default as Annotation[]).filter((a) => a.reqId === id);
    const taskMod = await import("@/data/tasks.json");
    const tasks = (taskMod.default as Task[]).filter((t) => t.requirementId === id);
    return { ...req, annotations, tasks } as RequirementDetail;
  });
}

// @req SCD-API-004
export async function listAnnotations(filters?: AnnotationFilters): Promise<ApiResult<Annotation[]>> {
  if (API_URL) {
    return fetchApi<Annotation[]>("/annotations", {
      type: filters?.type,
      orphans: filters?.orphans,
    });
  }
  return loadMock(async () => {
    const reqMod = await import("@/data/requirements.json");
    const validIds = new Set((reqMod.default as Requirement[]).map((r) => r.id));
    const annMod = await import("@/data/annotations.json");
    let items = annMod.default as Annotation[];
    if (filters?.type) items = items.filter((a) => a.type === filters.type);
    if (filters?.orphans) items = items.filter((a) => !validIds.has(a.reqId));
    return items;
  });
}

// @req SCD-API-005
export async function listTasks(filters?: TaskFilters): Promise<ApiResult<Task[]>> {
  if (API_URL) {
    return fetchApi<Task[]>("/tasks", {
      status: filters?.status,
      orphans: filters?.orphans,
      sort: filters?.sort,
      order: filters?.order,
    });
  }
  return loadMock(async () => {
    const reqMod = await import("@/data/requirements.json");
    const validIds = new Set((reqMod.default as Requirement[]).map((r) => r.id));
    const taskMod = await import("@/data/tasks.json");
    let items = taskMod.default as Task[];
    if (filters?.status) items = items.filter((t) => t.status === filters.status);
    if (filters?.orphans) items = items.filter((t) => !validIds.has(t.requirementId));
    const sort = filters?.sort ?? "id";
    const order = filters?.order ?? "asc";
    items = [...items].sort((a, b) => {
      const cmp = sort === "id" ? a.id.localeCompare(b.id) : a.updatedAt.localeCompare(b.updatedAt);
      return order === "asc" ? cmp : -cmp;
    });
    return items;
  });
}

// @req SCD-API-006
export async function triggerScan(): Promise<ApiResult<ScanStatus>> {
  if (API_URL) return fetchApi<ScanStatus>("/scan", undefined, { method: "POST" });
  return loadMock(async () => {
    const mod = await import("@/data/scan.json");
    return { ...mod.default, status: "scanning" as const, completedAt: undefined, duration: undefined } as ScanStatus;
  });
}

// @req SCD-API-006
export async function getScanStatus(): Promise<ApiResult<ScanStatus>> {
  if (API_URL) return fetchApi<ScanStatus>("/scan");
  return loadMock(async () => {
    const mod = await import("@/data/scan.json");
    return mod.default as ScanStatus;
  });
}
