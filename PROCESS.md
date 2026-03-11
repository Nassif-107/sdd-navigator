# PROCESS.md — AI Development Process Documentation

## 1. Tools Used

| Tool | Model | Purpose |
|------|-------|---------|
| Claude Code (CLI) | Claude Opus 4.6 | Primary development tool. Used for all code generation, file editing, test writing, debugging, and build verification. |
| Claude Code permission mode | `acceptEdits` | Auto-approved file edits throughout development, with manual review of Bash commands. |
| Next.js 16 + Turbopack | — | Framework and bundler. `next build` used as gatekeeper after every step. |
| Jest 30 + Testing Library | — | Unit and component tests. Run after each test-related change. |
| Playwright | — | E2E tests with system Chromium (`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`). |
| Vercel (web dashboard) | — | Production deployment. Manual deploy via vercel.com, not CLI. |

No IDE plugins, copilots, or other AI tools were used. All development was done through Claude Code CLI sessions.

---

## 2. Conversation Log

- **ID:** `71e198d2-711e-41bf-8d11-e12952e80d28`
- **Start:** 2026-03-11 14:38 UTC
- **End:** 2026-03-11 16:21 UTC
- **Duration:** ~1 hour 43 minutes
- **User messages:** 21
- **Tool rejections:** 1 (rejected Vercel CLI deployment)
- **Context overflow:** 1 (session compacted at ~15:50, continued with summary)

| Time (UTC) | Topic | Developer Action |
|------------|-------|-----------------|
| 14:44 | Spec completeness | "Check job posting URL and compare against requirements.yaml, specs/, CLAUDE.md." AI found gaps. |
| 14:48 | Patch gaps | "yes" — approved patching missing specs. |
| 14:51 | Step 1 re-execution | Executed restructured Step 1 (scaffold). New build-steps.md with SCD-* requirement IDs. |
| 14:55 | Commit attempt | "yes commit" — then **rejected** the commit (did not want to commit yet). |
| 14:57–15:00 | Step 2 types | Executed twice. **Corrected:** "step 2 must have one type file per model, not all together." |
| 15:02–15:19 | Steps 3–10 | Executed sequentially. Mock data, API client, layout, dashboard, requirements table, detail, tasks, orphans. |
| 15:08 | @req placement rule | **Key correction:** "Add to CLAUDE.md: @req tags MUST be placed on the function or component they trace, not grouped at the top of the file." Updated CLAUDE.md and build-steps.md. |
| 15:10 | Audit all files | "check if there are any other files with this issue" — AI moved all @req tags to individual functions. |
| 15:19–15:21 | Steps 11–12 | Scan button and tests. |
| 15:34 | E2E strict mode fixes | Detailed instructions: 9 failing tests, prescribed exact selectors, scoped locators, role queries. |
| 15:38 | 7 test gaps | Prescribed specific fixes: filter/sort tests, data imports, edge cases, chart test, network error test. |
| 15:46 | 4 more test gaps | Prescribed: real page.route error test, responsive viewport E2E, partial coverage, empty data. |
| 15:51 | Full test run | "run all tests, jest and playwright, lint, build." All passed (49 Jest, 19 E2E). |
| 15:56 | Step 13 enforcement | Created scripts/check-coverage.ts. |
| 16:01 | Script correction | **Corrected:** "change @req SCD-ERR-001 to ENF-007 — this script is enforcement, not error handling." Also: "add check:all script to package.json." |
| 16:02 | Step 14 deployment | AI attempted Vercel CLI. **Rejected** — "can i do it on vercel.com site? give me the instructions." |
| 16:04 | Manual deploy | AI provided Vercel web instructions. Developer deployed manually. |
| 16:12 | Production verification | Verified deployed app with real API. Asked if missing/partial statuses were expected. AI confirmed. |
| 16:20 | PROCESS.md | Requested this document with 7 specific sections. |

---

## 3. Timeline

| Time (UTC) | Duration | Step | What Happened |
|------------|----------|------|---------------|
| 14:38–14:48 | ~10m | Spec audit | Compared job posting against requirements.yaml, specs/, CLAUDE.md. Patched gaps. |
| 14:51–14:56 | ~5m | Step 1 | Scaffold re-execution with restructured build-steps.md using SCD-* IDs. |
| 14:57–15:00 | ~3m | Step 2 | Types — corrected from single file to one file per model. |
| 15:02–15:05 | ~3m | Step 3 | Mock data (8 requirements, 16 annotations, 6 tasks, stats, scan). |
| 15:05–15:08 | ~3m | Step 4 | API client with dual-mode (env var switch) and per-function @req tags. |
| 15:08–15:10 | ~2m | @req rule | Added traceability rule to CLAUDE.md, audited all files for compliance. |
| 15:10–15:12 | ~2m | Step 5 | Layout and theme provider with dark/light toggle. |
| 15:12–15:14 | ~2m | Step 6 | Dashboard summary panel with stats, progress bars, orphan warnings. |
| 15:14–15:16 | ~2m | Step 7 | Requirements table with URL-synced filters, sorting, responsive layout. |
| 15:16–15:18 | ~2m | Step 8 | Requirement detail view with annotations, tasks, coverage labels. |
| 15:18–15:19 | ~1m | Step 9 | Tasks panel with status filtering and orphan highlighting. |
| 15:19–15:20 | ~1m | Step 10 | Orphan panel with collapsible sections. |
| 15:20–15:21 | ~1m | Step 11 | Scan button with status polling. |
| 15:21–15:34 | ~13m | Step 12 | Tests — Jest config, component tests, E2E tests. |
| 15:34–15:50 | ~16m | Test hardening | 3 rounds of prescriptive test fixes (20 specific issues across 9 files). |
| 15:51–15:56 | ~5m | Full verification | All 49 Jest + 19 E2E pass, lint clean, build passes. |
| 15:56–16:01 | ~5m | Step 13 | Enforcement script (check-coverage.ts), developer review + corrections. |
| 16:02–16:13 | ~11m | Step 14 | Deployment config, README.md, Vercel web deploy, production verification. |
| 16:20–present | — | Step 15 | This PROCESS.md document. |

**Total session time:** ~1 hour 43 minutes

---

## 4. Key Decisions

### Architecture

| Decision | Why | Alternatives Considered |
|----------|-----|------------------------|
| **Next.js App Router with Server Components** | Job posting specified Next.js. App Router enables Server Components for data loading without client bundles. | Pages Router (simpler but older pattern). |
| **Dual-mode API client (env var switch)** | `NEXT_PUBLIC_API_URL` set → fetch live API; unset → import local JSON. Lets the app work offline and with real data. | Separate mock server, MSW service worker. |
| **`ApiResult<T>` discriminated union** | Type-safe error handling without exceptions. `{ ok: true, data: T } \| { ok: false, error: ApiError }`. | Throwing exceptions (violates SCD-ERR-001), nullable returns. |
| **URL-synced filters via `useSearchParams`** | Shareable, bookmarkable filter states. Required by SCD-UI-002. | Component-local state (not shareable), Redux (overkill). |
| **Tailwind CSS v4 class-based dark mode** | Zero-JS theme system with `html.dark` class toggle. Persists via localStorage. | CSS custom properties only, next-themes package. |

### Process

| Decision | Why | Alternatives Considered |
|----------|-----|------------------------|
| **One type file per model** | Developer corrected AI's monolithic types file. Follows single-responsibility and makes imports explicit. | Single `types/index.ts` with all interfaces (AI's initial approach). |
| **@req tags on individual functions, not file tops** | Developer identified that file-level grouping breaks traceability at the function level. Added as CLAUDE.md rule. | File-level @req tags (AI's initial approach). |
| **Manual Vercel web deploy over CLI** | CLI required auth token not available in sandbox. Web dashboard is simpler for one-time deploy. | Vercel CLI with token, Netlify, Docker. |
| **`jest.isolateModules` for env-dependent tests** | `NEXT_PUBLIC_API_URL` is captured at module load time. Isolated re-import is the only way to test both modes. | Separate test files, manual module cache clearing. |

---

## 5. What the Developer Controlled

### Code Review and Corrections

The developer reviewed AI output and made corrections in these areas:

**File structure:**
- Rejected single-file types (`src/types/index.ts` with all interfaces). Required separate files: `requirement.ts`, `annotation.ts`, `task.ts`, `stats.ts`, `scan.ts`, `error.ts`, `enums.ts`.

**Traceability rules:**
- Identified @req tags grouped at file tops across `lib/api.ts`, `types/enums.ts`, `components/requirements-table.tsx`, and others. Required per-function placement. Updated CLAUDE.md and build-steps.md to codify this rule.
- Corrected `scripts/check-coverage.ts` tag from `@req SCD-ERR-001` to `// ENF-007`.

**Test quality (3 rounds of specific instructions):**
- Round 1: 9 E2E strict mode violations — prescribed exact selectors, scoped locators, `{ exact: true }`.
- Round 2: 7 specific test gaps — filter/sort tests in requirements-table.test.tsx and tasks-panel.test.tsx, data imports instead of hardcoded mocks in requirement-detail.test.tsx, edge cases (0%, 100% coverage) and malformed response test in api.test.ts, prefers-color-scheme test in theme-toggle.test.tsx, chart rendering test in dashboard.spec.ts, network error test in error-states.spec.ts.
- Round 3: 4 more test gaps — real page.route error test with fetch/xhr abort, responsive viewport E2E (375x667), partial coverage edge case (33.3%), empty data edge case.

**Configuration:**
- Added `check:all` script to package.json (`tsc --noEmit → lint → test → check:coverage → build`).
- Corrected enforcement script categorization (ENF-007, not SCD-ERR-001).

### Verification Steps

Before accepting AI output, the developer:
1. Ran `npm run build` after every component step.
2. Ran `npm test` after every test change.
3. Ran `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser npm run test:e2e` after E2E changes.
4. Ran `npm run lint` before finalizing.
5. Ran `npm run check:coverage` to verify traceability.
6. Deployed to Vercel and manually verified the live app with the real API.
7. Checked that missing/partial requirement statuses on the live site matched expected API data.

---

## 6. Course Corrections

### 1. Type File Organization (15:00)

- **Issue:** AI created a single `src/types/index.ts` with all interfaces bundled together.
- **How caught:** Developer reviewed the generated file structure.
- **Resolution:** "step 2 must have one type file per model, not all together." AI split into 7 separate files with a barrel re-export.

### 2. @req Tag Placement (15:08)

- **Issue:** AI grouped `@req` tags at the top of files (e.g., `// @req SCD-API-001` through `// @req SCD-API-006` all at line 1–6 of `lib/api.ts`), breaking function-level traceability.
- **How caught:** Developer noticed during code review.
- **Resolution:** Added rule to CLAUDE.md, updated build-steps.md, then audited all files. AI moved every @req tag to directly above the function or type it traces.

### 3. Test Quality — Multiple Rounds (15:34–15:50)

- **Issue (a):** 9 E2E tests failed due to Playwright strict mode — selectors matched multiple elements (desktop table + mobile cards render text twice).
- **Issue (b):** Missing test coverage for filters, sorting, edge cases, responsive layout, and error states.
- **Issue (c):** Fake network error test didn't actually intercept requests; responsive test didn't exist.
- **How caught:** Developer ran tests and read failure output; compared tests against specs/testing.md.
- **Resolution:** Developer gave prescriptive, line-level fix instructions for each issue rather than letting AI guess. Three rounds of specific corrections covering 20 individual test issues across 9 files.

### 4. Enforcement Script Tag (16:01)

- **Issue:** `scripts/check-coverage.ts` was tagged `@req SCD-ERR-001` (error handling), but it's an enforcement tool (`ENF-007`).
- **How caught:** Developer reviewed the generated script.
- **Resolution:** Changed to `// ENF-007` comment.

### 5. Deployment Method (16:02)

- **Issue:** AI attempted Vercel CLI deployment, which required authentication not available in the sandbox environment.
- **How caught:** `vercel whoami` returned "No existing credentials found."
- **Resolution:** Developer rejected CLI approach. "can i do it on vercel.com site? give me the instructions." Deployed manually via Vercel web dashboard.

---

## 7. Self-Assessment

### Traceability — Strong

- Every source file has `@req SCD-*` tags on individual functions and components.
- Every test file references its requirement ID.
- `scripts/check-coverage.ts` enforces traceability: parses requirements.yaml, scans all source/test/e2e files, reports gaps, exits 1 on missing references.
- Current report: **16/16 requirements have source references** (15 fully traced with tests, 1 deployment-only).
- `requirements.yaml` is the single source of truth for all requirement IDs with descriptions.

**Could improve:** Commit-level traceability (format `type(scope): message [SCD-*]`) was defined but not enforced by a pre-commit hook.

### DRY — Strong

- Types defined once in `src/types/` — all components, API client, mock data, and tests reference this single source.
- API client defined once in `lib/api.ts` — all data fetching goes through it.
- Filter logic shared via `FilterChips` and `SortToggle` components across requirements and tasks pages.
- Tests import from `src/data/*.json` instead of hardcoding mock data.
- Specs referenced by path/ID — no duplicated spec content between files.

**Could improve:** Some filter chip options (`TYPE_OPTIONS`, `STATUS_OPTIONS`) are defined as local constants in components rather than derived from the type system.

### Deterministic Enforcement — Strong

- TypeScript strict mode enabled.
- ESLint with next/core-web-vitals and next/typescript — 0 errors, 0 warnings.
- `npm run check:all` runs full pipeline: `tsc --noEmit → lint → test → check:coverage → build`.
- 49 Jest tests + 19 Playwright E2E tests all passing.
- `check-coverage.ts` exits 1 if any requirement lacks a source reference.

**Could improve:** No pre-commit hook or CI pipeline wired up to run `check:all` automatically. Currently relies on manual execution.

### Parsimony — Good

- Minimal dependencies: Next.js, React, Tailwind CSS, Recharts (4 runtime deps).
- No unnecessary abstractions — components are focused, functions under 100 lines.
- CLAUDE.md is concise rules, not prose. Specs are atomic files.
- No dead code — enforcement script would catch unreferenced requirement IDs.

**Could improve:** Some components (`summary-panel.tsx`) contain multiple sub-components (Card, TypeBreakdown, ProgressBar, StatusBars, OrphanWarnings) that could arguably be separate files per the one-concern-per-file rule. Kept together for cohesion since they're only used by the summary panel.
