// @req SCD-API-001
// @req SCD-API-002
// @req SCD-API-003
// @req SCD-API-004
// @req SCD-API-005
// @req SCD-API-006

export type RequirementType = "FR" | "AR";

export type CoverageStatus = "covered" | "partial" | "missing";

export type AnnotationType = "impl" | "test";

export type TaskStatus = "open" | "in_progress" | "done";

export type ScanState = "idle" | "scanning" | "completed" | "failed";

export type HealthStatus = "healthy" | "degraded";
