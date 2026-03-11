# Testing Strategy

## Frameworks
- Jest + @testing-library/react — unit and component tests
- Playwright — E2E tests

## Test Annotation
Every test MUST include `// @req SCD-*` comment referencing requirement from requirements.yaml.

## Data Layer Tests [SCD-API-001..006]
- Valid API responses parsed correctly
- Malformed responses return typed errors
- Network failures return typed errors
- Mock mode returns correct data from JSON files
- Orphan detection for annotations and tasks
- Edge cases: 0% coverage, 100% coverage, partial coverage

## Component Tests

### SummaryPanel [SCD-UI-001]
- Renders correct counts from stats
- Shows warning indicators for orphans

### RequirementsTable [SCD-UI-002]
- Renders correct rows
- Filtering by type produces correct subset
- Filtering by status produces correct subset
- Sorting by ID changes order
- Sorting by updatedAt changes order
- Empty state renders when no matches

### RequirementDetail [SCD-UI-003]
- Displays all metadata fields
- Renders linked annotations with snippets
- Renders linked tasks
- Shows correct coverage label

### TasksPanel [SCD-UI-004]
- Renders task rows
- Filters by status correctly
- Highlights orphan tasks

### OrphanPanel [SCD-UI-005]
- Renders annotation orphans
- Renders task orphans
- Collapses/expands

### ThemeToggle [SCD-UI-006]
- Toggles between dark and light
- Persists selection

## E2E Tests

### Dashboard [SCD-UI-001, SCD-API-001]
- Page loads, summary panel displays stats
- Charts render

### Requirements [SCD-UI-002, SCD-UI-003]
- Table loads with rows
- Filter by type — rows change
- Filter by status — rows change
- Sort toggle works
- Click row — navigates to detail
- Detail shows annotations and tasks
- Back preserves filters

### Tasks [SCD-UI-004, SCD-UI-005]
- Tasks table loads
- Filter by status works
- Orphan tasks highlighted
- Orphan panel renders

### Accessibility [SCD-ACC-001]
- Tab navigation through table
- aria-sort present on sortable columns

### Error States [SCD-ERR-001]
- Loading indicator visible during fetch
- Error message on network failure
