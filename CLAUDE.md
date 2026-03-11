# SDD Navigator Dashboard

## Stack

- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Recharts (charts)
- API: https://api.pdd.foreachpartners.com
- API Spec: https://api.pdd.foreachpartners.com/spec/sdd-coverage-api.yaml

## Modes

- **API mode**: `NEXT_PUBLIC_API_URL` env var set → fetch from live API
- **Mock mode**: env var unset → load from local JSON in `src/data/`

## Specs

- `requirements.yaml` — all dashboard requirements (SCD-* IDs with descriptions)
- `specs/api.md` — API endpoints and contracts
- `specs/data-model.md` — TypeScript types matching API schema
- `specs/components.md` — UI component specs
- `specs/testing.md` — test strategy and requirements
- `specs/enforcement.md` — enforcement rules and scripts
- `specs/build-steps.md` — ordered build plan

DO NOT duplicate spec content. Reference by path or ID.

## Rules

### Traceability
- Every code file that implements behavior MUST have a `// @req SCD-*` comment linking to its requirement
- Every test file MUST reference its requirement ID with `// @req SCD-*`
- Every commit MUST reference a requirement ID: `type(scope): message [SCD-*]`
- No dead code — code without a linked requirement MUST be removed
- No unimplemented requirements — every SCD-* ID MUST appear in code

### DRY
- Types defined once in `src/types/` — API responses, mock data, and components MUST reference this single source
- DO NOT duplicate type definitions, constants, or config across files
- API client defined once in `lib/api.ts` — all data fetching MUST go through it
- Filter logic MUST be shared, not duplicated between pages
- Reference specs by path or ID — DO NOT copy spec content between files
- One test file per source file — mirror `src/` structure under `__tests__/`
- DO NOT hardcode mock data in tests — import from `src/data/` or derive from existing fixtures

### Deterministic Enforcement
- TypeScript strict mode (`"strict": true` in tsconfig.json)
- ESLint with next/core-web-vitals and next/typescript
- `scripts/check-coverage.ts` — parse requirements.yaml, scan source for @req annotations, print coverage report, exit 1 if gaps
- `tsc --noEmit` MUST pass before commit
- `next build` MUST pass before commit
- All tests MUST pass before commit

### Code Quality
- One concern per file — no mixed responsibilities
- No business logic in page files — pages compose components only
- Functions MUST NOT exceed 100 lines
- No unused imports, variables, or dead code
- Prefer named exports over default exports
- No `any` types — every function and variable MUST be typed

### Parsimony
- Directive vocabulary: MUST, SHOULD, MAY, DO NOT
- Dependencies MUST be minimal and justified
- No boilerplate abstractions or unused modules
- README MUST be concise and factual

### Conventions
- Commit format: `type(scope): message [SCD-*]`
- File naming: kebab-case for files, PascalCase for components
- Requirement IDs: `SCD-{DOMAIN}-{NNN}` (API, UI, ACC, ERR, DEP)

## File Structure

```
requirements.yaml       # All requirements (single source of truth)
specs/                   # Atomic spec files (one per domain)
src/
  types/                 # Single source of truth for all types
  data/                  # Mock data (JSON matching API schema)
  lib/
    api.ts               # Typed API client (API mode + mock fallback)
  app/
    layout.tsx           # Root layout with theme provider
    page.tsx             # Dashboard (summary panel)
    requirements/        # Requirements table + detail pages
    tasks/               # Tasks panel page
    api/                 # NOT used — we consume external API
  components/            # UI components (no business logic in pages)
scripts/
  check-coverage.ts      # Traceability enforcement
__tests__/               # Jest tests mirroring src/ structure
e2e/                     # Playwright E2E tests
```

## Deliverables

- Full source code
- `requirements.yaml` with descriptions on every entry
- Mock data files (8+ requirements, 16+ annotations, 6+ tasks)
- Deployed live URL in README.md
- `PROCESS.md` (AI development process documentation)
