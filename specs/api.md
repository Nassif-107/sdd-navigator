# API Endpoints

Source: https://api.pdd.foreachpartners.com/spec/sdd-coverage-api.yaml

## Endpoints

| Method | Path | Params | Response | Req ID |
|--------|------|--------|----------|--------|
| GET | /stats | — | Stats | SCD-API-001 |
| GET | /requirements | type?, status?, sort?, order? | Requirement[] | SCD-API-002 |
| GET | /requirements/{id} | — | RequirementDetail | SCD-API-003 |
| GET | /annotations | type?, orphans? | Annotation[] | SCD-API-004 |
| GET | /tasks | status?, orphans?, sort?, order? | Task[] | SCD-API-005 |
| POST | /scan | — | ScanStatus (202) | SCD-API-006 |
| GET | /scan | — | ScanStatus | SCD-API-006 |
| GET | /healthcheck | — | HealthCheck | — |

## Query Parameters

### GET /requirements
- `type`: enum [FR, AR]
- `status`: enum [covered, partial, missing]
- `sort`: enum [id, updatedAt], default: id
- `order`: enum [asc, desc], default: asc

### GET /annotations
- `type`: enum [impl, test]
- `orphans`: boolean, default: false

### GET /tasks
- `status`: enum [open, in_progress, done]
- `orphans`: boolean, default: false
- `sort`: enum [id, updatedAt], default: id
- `order`: enum [asc, desc], default: asc

## Error Responses

- 404: `{ error: string, message: string }`
- Network failure: typed error, DO NOT throw exceptions for expected failures
