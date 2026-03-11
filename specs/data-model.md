# Data Model

Types defined once in `src/types/`. All match API schema exactly.

## Enums

- `RequirementType`: "FR" | "AR"
- `CoverageStatus`: "covered" | "partial" | "missing"
- `AnnotationType`: "impl" | "test"
- `TaskStatus`: "open" | "in_progress" | "done"
- `ScanState`: "idle" | "scanning" | "completed" | "failed"
- `HealthStatus`: "healthy" | "degraded"

## Models

### Requirement
- `id`: string (pattern: TYPE-DOMAIN-NNN)
- `type`: RequirementType
- `title`: string
- `description`: string
- `status`: CoverageStatus
- `createdAt`: string (ISO date-time)
- `updatedAt`: string (ISO date-time)

### RequirementDetail (extends Requirement)
- `annotations`: Annotation[]
- `tasks`: Task[]

### Annotation
- `file`: string (relative path)
- `line`: integer
- `reqId`: string
- `type`: AnnotationType
- `snippet`: string (code context)

### Task
- `id`: string
- `requirementId`: string
- `title`: string
- `status`: TaskStatus
- `assignee`: string | undefined
- `createdAt`: string (ISO date-time)
- `updatedAt`: string (ISO date-time)

### Stats
- `requirements`: { total, byType: Record<RequirementType, number>, byStatus: Record<CoverageStatus, number> }
- `annotations`: { total, impl, test, orphans }
- `tasks`: { total, byStatus: Record<TaskStatus, number>, orphans }
- `coverage`: number (percentage)
- `lastScanAt`: string (ISO date-time)

### ScanStatus
- `status`: ScanState
- `startedAt`: string (ISO date-time)
- `completedAt`: string | undefined
- `duration`: number | undefined (ms)

### Error
- `error`: string
- `message`: string
