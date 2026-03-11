# Enforcement Rules

## Deterministic Checks (Level 1)

- `ENF-001`: TypeScript strict mode — `"strict": true` in tsconfig.json
- `ENF-002`: ESLint — next/core-web-vitals + next/typescript
- `ENF-003`: `tsc --noEmit` MUST pass
- `ENF-004`: `next build` MUST pass
- `ENF-005`: All Jest tests MUST pass
- `ENF-006`: All Playwright tests MUST pass

## Traceability Check (Level 2)

- `ENF-007`: `scripts/check-coverage.ts`
  - Parse `requirements.yaml` for all SCD-* IDs
  - Scan `src/` and `__tests__/` and `e2e/` for `@req SCD-*` comments
  - Print coverage report: which IDs have code, which have tests
  - Exit code 1 if any requirement has no code reference

## Pre-Commit Checklist

```bash
tsc --noEmit
npm run lint
npm run test
npm run check:coverage
npm run build
```
