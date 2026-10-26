---
last_mapped_commit: 9b578c083b8d6e975b378f9f680d48d53e2f8a8c
last_mapped_at: 2026-10-25
---

# External Integrations

**Analysis Date:** 2026-10-25

## APIs & External Services

**Query parsing library:**

- `@rapiq/*` 2.4.0 (`core`, `adapter-typeorm`, `codec-url`) - In-process query DSL (filtering/sorting/pagination) over TypeORM; not a remote API. Used in `src/shared/interceptors/pagination.interceptor.ts` and `src/shared/providers/schema-registry.provider.ts`.

**External HTTP APIs:**

- None detected. No HTTP client (axios/fetch/HttpModule) usage in `src/`.

## Data Storage

**Databases:**

- Microsoft SQL Server (MSSQL)
  - Connection: `MSSQL_HOST`, `MSSQL_PORT`, `MSSQL_DB`, `MSSQL_USER`, `MSSQL_PASSWORD` / `MSSQL_SA_PASSWORD`
  - Client: `mssql` 12.7.11 driver via TypeORM (`type: 'mssql'`)
  - ORM: TypeORM 1.1.2 (`@nestjs/typeorm` 12.0.2)
  - Config: `src/config/typeorm.ts` (runtime), `data-source.ts` (CLI/migrations/seeds)
  - `synchronize: false` (migrations required)
  - Driver options: `encrypt: false`, `trustServerCertificate: true`, `appName: 'Northwind API'`

**File Storage:**

- Local filesystem only (static JSON seed data under `src/database/seeds/*.json` and `src/**/seeds/*.json`)

**Caching:**

- None detected (no Redis/cache module)

## Authentication & Identity

**Auth Provider:**

- None / Custom: No authentication or authorization implemented. No guards, JWT, or identity provider detected. `class-validator` container integration (`src/main.ts`) only.

## Monitoring & Observability

**Error Tracking:**

- None (no Sentry/etc.)

**Logs:**

- TypeORM SQL logging enabled (`logging: true` in `data-source.ts`; runtime config has no explicit logging flag)
- NestJS default logger
- No structured logging library detected

## CI/CD & Deployment

**Hosting:**

- Docker image (multi-stage build, Distroless Node 26) published to GitHub Container Registry (`ghcr.io`)
- Kubernetes manifests under `k8s/` (Deployment, Service, Job for migrations/seeds, PVC, SQL Server)

**CI Pipeline:**

- GitHub Actions (`.github/workflows/ci.yml`) - format/lint/typecheck/build, migrations+seeds, server start, unit/e2e/feature/api tests
- `.github/workflows/k8s.yml` - Docker build + Kind cluster deployment test
- `.github/workflows/publish.yml` - Docker image publish on tags
- `.github/workflows/release.yml` - semantic-release on master

**Database migration/seeding in CI:**

- `pnpm typeorm migration:run` then `pnpm typeorm-extension seed:run`
- MSSQL service container (`mcr.microsoft.com/mssql/server:2025-latest`)

## Environment Configuration

**Required env vars:**

- `MSSQL_PASSWORD` (or `MSSQL_SA_PASSWORD` when `MSSQL_USER=sa`)
- `MSSQL_DB` (default `northwind`)
- `MSSQL_USER` (default `instnwnd`)
- `MSSQL_HOST` (default `localhost`)
- `MSSQL_PORT` (default `1433`)
- `PORT` (default `3000`)
- `CI` (skips password assertion in CI)
- `PACTUM_REQUEST_BASE_URL` (feature tests, default `http://localhost:3000`)
- `MISE_AGE_KEY` (decrypts mise env)

**Secrets location:**

- `.env` (gitignored) and `.devcontainer/.env`
- GitHub Actions secrets (`MSSQL_SA_PASSWORD`, `MSSQL_PASSWORD`, `MISE_AGE_KEY`, `GITHUB_TOKEN`, app credentials)
- mise age-encrypted values in `mise.toml`

## Webhooks & Callbacks

**Incoming:**

- None detected (no webhook endpoints)

**Outgoing:**

- None detected

---

_Integration audit: 2026-10-25_
