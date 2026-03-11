// @req SCD-API-002
export type RequirementType = "FR" | "AR";

// @req SCD-API-002
export type CoverageStatus = "covered" | "partial" | "missing";

// @req SCD-API-004
export type AnnotationType = "impl" | "test";

// @req SCD-API-005
export type TaskStatus = "open" | "in_progress" | "done";

// @req SCD-API-006
export type ScanState = "idle" | "scanning" | "completed" | "failed";

// @req SCD-API-001
export type HealthStatus = "healthy" | "degraded";
