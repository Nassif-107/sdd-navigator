# Build Steps

Each step MUST be completed and committed before starting the next.
Every commit MUST reference requirement IDs.

---

## Step 1: Project Scaffold [ENF-001, ENF-002]
- Initialize Next.js 14+ with App Router, TypeScript strict, Tailwind CSS
- Install dependencies: React, Recharts
- Configure ESLint
- Create directory structure per CLAUDE.md
- Add `.env.example` with `NEXT_PUBLIC_API_URL=https://api.pdd.foreachpartners.com`
- Verify `npm run build` passes
- **Commit:** `chore(init): scaffold project [ENF-001] [ENF-002]`

---

## Step 2: Types [SCD-API-001..006]
- Create `src/types/` with all models from specs/data-model.md
- Single entry point `src/types/index.ts`
- All types MUST use named exports
- **Commit:** `feat(types): define shared type definitions [SCD-API-001]`

---

## Step 3: Mock Data
- Create `src/data/requirements.json` — 8 requirements (FR + AR, varied statuses)
- Create `src/data/annotations.json` — 16 annotations (14 linked + 2 orphans, impl + test)
- Create `src/data/tasks.json` — 6 tasks (5 linked + 1 orphan, varied statuses)
- Create `src/data/stats.json` — computed from above (coverage 62.5%)
- Create `src/data/scan.json` — idle scan status
- All MUST conform to types in `src/types/`
- **Commit:** `feat(data): add mock data files [SCD-API-001]`

---

## Step 4: API Client [SCD-API-001..006]
- Create `lib/api.ts` with typed functions:
  - `getStats()` → Stats
  - `listRequirements(filters?)` → Requirement[]
  - `getRequirement(id)` → RequirementDetail
  - `listAnnotations(filters?)` → Annotation[]
  - `listTasks(filters?)` → Task[]
  - `triggerScan()` → ScanStatus
  - `getScanStatus()` → ScanStatus
- If `NEXT_PUBLIC_API_URL` set → fetch from API
- If unset → import from `src/data/*.json`
- Typed error handling for network failures, 404s, malformed responses
- No `any` types
- **Commit:** `feat(api): implement typed API client with mock fallback [SCD-API-001] [SCD-API-002] [SCD-API-003] [SCD-API-004] [SCD-API-005] [SCD-API-006]`

---

## Step 5: Layout and Theme [SCD-UI-006]
- Create root `layout.tsx` with theme provider
- ThemeToggle component: dark/light, localStorage, prefers-color-scheme
- **Commit:** `feat(ui): add layout with dark/light theme toggle [SCD-UI-006]`

---

## Step 6: Dashboard — Summary Panel [SCD-UI-001, SCD-ERR-001]
- Create `src/components/summary-panel.tsx`
- Dashboard page fetches from getStats(), passes data to component
- Loading and error states
- **Commit:** `feat(dashboard): add summary panel [SCD-UI-001] [SCD-ERR-001]`

---

## Step 7: Requirements Table [SCD-UI-002, SCD-UI-007, SCD-ACC-001]
- Create `src/app/requirements/page.tsx`
- Create `src/components/requirements-table.tsx`
- Create `src/components/filter-chips.tsx`
- Create `src/components/sort-toggle.tsx`
- URL-synced filters via query params
- Responsive: table on desktop, cards on mobile
- Keyboard nav, aria-sort
- **Commit:** `feat(requirements): add table with filters and sorting [SCD-UI-002] [SCD-UI-007] [SCD-ACC-001]`

---

## Step 8: Requirement Detail [SCD-UI-003]
- Create `src/app/requirements/[id]/page.tsx`
- Create `src/components/requirement-detail.tsx`
- Create `src/components/annotation-list.tsx`
- Create `src/components/task-list.tsx`
- Create `src/components/coverage-label.tsx`
- Back navigation preserves filters
- **Commit:** `feat(detail): add requirement detail view [SCD-UI-003]`

---

## Step 9: Tasks Panel [SCD-UI-004]
- Create `src/app/tasks/page.tsx`
- Create `src/components/tasks-panel.tsx`
- Filter by status, highlight orphans
- **Commit:** `feat(tasks): add tasks panel [SCD-UI-004]`

---

## Step 10: Orphan Panel [SCD-UI-005]
- Create `src/components/orphan-panel.tsx`
- Collapsible sections for annotation and task orphans
- **Commit:** `feat(orphans): add orphan panel [SCD-UI-005]`

---

## Step 11: Scan Button [SCD-API-006]
- Create `src/components/scan-button.tsx`
- Trigger POST /scan, show status
- **Commit:** `feat(scan): add scan trigger button [SCD-API-006]`

---

## Step 12: Tests [ENF-005, ENF-006]
- Install Jest + @testing-library/react + Playwright
- Write unit tests for lib/api.ts
- Write component tests for all components
- Write E2E tests per specs/testing.md
- **Commit:** `test: add Jest and Playwright tests [ENF-005] [ENF-006]`

---

## Step 13: Enforcement Script [ENF-007]
- Create `scripts/check-coverage.ts`
- Parse requirements.yaml, scan for @req, report, exit 1 on gaps
- **Commit:** `chore(enforce): add coverage check script [ENF-007]`

---

## Step 14: Deployment [SCD-DEP-001]
- Deploy to Vercel or Netlify
- Add live URL to README.md
- **Commit:** `chore(deploy): add deployment config [SCD-DEP-001]`

---

## Step 15: PROCESS.md
- Document AI tools used, conversation log, timeline, key decisions
- Self-assessment against 4 pillars
- **Commit:** `docs: add PROCESS.md [SCD-DEP-001]`
