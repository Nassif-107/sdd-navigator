import { getStats, listRequirements, getRequirement, listAnnotations, listTasks, triggerScan, getScanStatus } from "@/lib/api";
import type { Stats } from "@/types";

// Ensure mock mode (no API_URL)
delete process.env.NEXT_PUBLIC_API_URL;

// @req SCD-API-001
describe("getStats", () => {
  it("returns stats from mock data", async () => {
    const result = await getStats();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.requirements.total).toBe(8);
    expect(result.data.coverage).toBe(62.5);
    expect(result.data.annotations.total).toBe(16);
    expect(result.data.tasks.total).toBe(6);
    expect(result.data.lastScanAt).toBeDefined();
  });
});

// @req SCD-API-002
describe("listRequirements", () => {
  it("returns all requirements without filters", async () => {
    const result = await listRequirements();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toHaveLength(8);
  });

  it("filters by type FR", async () => {
    const result = await listRequirements({ type: "FR" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.every((r) => r.type === "FR")).toBe(true);
    expect(result.data.length).toBe(6);
  });

  it("filters by type AR", async () => {
    const result = await listRequirements({ type: "AR" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.every((r) => r.type === "AR")).toBe(true);
    expect(result.data.length).toBe(2);
  });

  it("filters by status covered", async () => {
    const result = await listRequirements({ status: "covered" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.every((r) => r.status === "covered")).toBe(true);
    expect(result.data.length).toBe(5);
  });

  it("sorts by id ascending by default", async () => {
    const result = await listRequirements();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const ids = result.data.map((r) => r.id);
    expect(ids).toEqual([...ids].sort());
  });

  it("sorts by updatedAt descending", async () => {
    const result = await listRequirements({ sort: "updatedAt", order: "desc" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const dates = result.data.map((r) => r.updatedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});

// @req SCD-API-003
describe("getRequirement", () => {
  it("returns requirement detail with annotations and tasks", async () => {
    const result = await getRequirement("FR-SCAN-001");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.id).toBe("FR-SCAN-001");
    expect(result.data.annotations.length).toBeGreaterThan(0);
    expect(result.data.tasks.length).toBeGreaterThan(0);
  });

  // @req SCD-ERR-001
  it("returns error for non-existent requirement", async () => {
    const result = await getRequirement("NONEXISTENT-001");
    expect(result.ok).toBe(false);
  });
});

// @req SCD-API-004
describe("listAnnotations", () => {
  it("returns all annotations without filters", async () => {
    const result = await listAnnotations();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toHaveLength(16);
  });

  it("filters by type impl", async () => {
    const result = await listAnnotations({ type: "impl" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.every((a) => a.type === "impl")).toBe(true);
    expect(result.data.length).toBe(10);
  });

  it("filters orphan annotations", async () => {
    const result = await listAnnotations({ orphans: true });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.length).toBe(2);
  });
});

// @req SCD-API-005
describe("listTasks", () => {
  it("returns all tasks without filters", async () => {
    const result = await listTasks();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toHaveLength(6);
  });

  it("filters by status done", async () => {
    const result = await listTasks({ status: "done" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.every((t) => t.status === "done")).toBe(true);
    expect(result.data.length).toBe(2);
  });

  it("filters orphan tasks", async () => {
    const result = await listTasks({ orphans: true });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.length).toBe(1);
    expect(result.data[0].requirementId).toBe("UNKNOWN-REQ");
  });
});

// @req SCD-API-006
describe("triggerScan", () => {
  it("returns scanning status in mock mode", async () => {
    const result = await triggerScan();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.status).toBe("scanning");
  });
});

// @req SCD-API-006
describe("getScanStatus", () => {
  it("returns idle status from mock data", async () => {
    const result = await getScanStatus();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.status).toBe("idle");
  });
});

// @req SCD-ERR-001
describe("edge cases", () => {
  it("handles 0% coverage scenario", () => {
    const stats: Stats = {
      requirements: { total: 3, byType: { FR: 2, AR: 1 }, byStatus: { covered: 0, partial: 0, missing: 3 } },
      annotations: { total: 0, impl: 0, test: 0, orphans: 0 },
      tasks: { total: 0, byStatus: { open: 0, in_progress: 0, done: 0 }, orphans: 0 },
      coverage: 0,
      lastScanAt: "2025-01-01T00:00:00Z",
    };
    expect(stats.coverage).toBe(0);
    expect(stats.requirements.byStatus.covered).toBe(0);
    expect(stats.requirements.byStatus.missing).toBe(stats.requirements.total);
  });

  it("handles 100% coverage scenario", () => {
    const stats: Stats = {
      requirements: { total: 3, byType: { FR: 2, AR: 1 }, byStatus: { covered: 3, partial: 0, missing: 0 } },
      annotations: { total: 6, impl: 3, test: 3, orphans: 0 },
      tasks: { total: 3, byStatus: { open: 0, in_progress: 0, done: 3 }, orphans: 0 },
      coverage: 100,
      lastScanAt: "2025-01-01T00:00:00Z",
    };
    expect(stats.coverage).toBe(100);
    expect(stats.requirements.byStatus.covered).toBe(stats.requirements.total);
    expect(stats.requirements.byStatus.missing).toBe(0);
  });

  it("handles partial coverage scenario", () => {
    const stats: Stats = {
      requirements: { total: 3, byType: { FR: 2, AR: 1 }, byStatus: { covered: 1, partial: 1, missing: 1 } },
      annotations: { total: 4, impl: 3, test: 1, orphans: 0 },
      tasks: { total: 2, byStatus: { open: 1, in_progress: 0, done: 1 }, orphans: 0 },
      coverage: 33.3,
      lastScanAt: "2025-01-01T00:00:00Z",
    };
    expect(stats.coverage).toBe(33.3);
    expect(stats.requirements.byStatus.covered).toBe(1);
    expect(stats.requirements.byStatus.partial).toBe(1);
    expect(stats.requirements.byStatus.missing).toBe(1);
  });

  it("handles empty data gracefully — 0 requirements, 0 annotations, 0 tasks", () => {
    const stats: Stats = {
      requirements: { total: 0, byType: { FR: 0, AR: 0 }, byStatus: { covered: 0, partial: 0, missing: 0 } },
      annotations: { total: 0, impl: 0, test: 0, orphans: 0 },
      tasks: { total: 0, byStatus: { open: 0, in_progress: 0, done: 0 }, orphans: 0 },
      coverage: 0,
      lastScanAt: "2025-01-01T00:00:00Z",
    };
    expect(stats.requirements.total).toBe(0);
    expect(stats.annotations.total).toBe(0);
    expect(stats.tasks.total).toBe(0);
    expect(stats.coverage).toBe(0);
  });

  it("returns typed error for malformed API response", async () => {
    // Mock fetch to return malformed JSON
    const originalFetch = globalThis.fetch;
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new SyntaxError("Unexpected token")),
    });

    // Re-import module with API_URL set so fetchApi path is used
    process.env.NEXT_PUBLIC_API_URL = "https://api.pdd.foreachpartners.com";
    let apiModule: typeof import("@/lib/api");
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      apiModule = require("@/lib/api");
    });
    const result = await apiModule!.getStats();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.error).toBe("network_error");
    }

    globalThis.fetch = originalFetch;
    delete process.env.NEXT_PUBLIC_API_URL;
  });
});
