# UI Components

All components in `src/components/`. No business logic in page files.

## Dashboard Page (`/`)

### SummaryPanel [SCD-UI-001]
- Total requirements count
- Breakdown by type (FR/AR) as numbers
- Breakdown by coverage status (covered/partial/missing) as numbers with visual bars
- Overall coverage percentage with progress indicator
- Annotation orphan count + task orphan count with warning indicators
- Last scan timestamp (lastScanAt)

### ScanButton [SCD-API-006]
- Triggers POST /scan
- Shows current scan status (idle/scanning/completed/failed)

## Requirements Page (`/requirements`)

### RequirementsTable [SCD-UI-002]
- Columns: ID, type, title, status, updatedAt
- Sorting: by ID or updatedAt, asc/desc toggle
- Filtering: type (FR/AR) + status (covered/partial/missing) via multi-select chips
- Filters sync to URL query params (`?type=FR&status=missing`)
- Empty state when no results match
- Row click navigates to detail

### RequirementDetail (`/requirements/[id]`) [SCD-UI-003]
- Fields: id, type, title, description, status, createdAt, updatedAt
- Linked annotations: file path, line number, type, code snippet
- Linked tasks: id, title, status, assignee, updatedAt
- Coverage label: "Fully covered" / "Needs tests" / "Not implemented"
- Back navigation preserves current filters

## Tasks Page (`/tasks`)

### TasksPanel [SCD-UI-004]
- Columns: ID, requirement ID, title, status, assignee
- Filter by task status (open/in_progress/done)
- Orphan tasks highlighted distinctly

### OrphanPanel [SCD-UI-005]
- Collapsible section for annotation orphans (file, line, reqId, type)
- Subsection for task orphans (id, title, requirementId)

## Global

### ThemeToggle [SCD-UI-006]
- Dark/light switch
- Persists in localStorage
- Respects prefers-color-scheme on first visit

### ResponsiveLayout [SCD-UI-007]
- Desktop: table layout
- Mobile: card layout
