---
last_mapped_commit: 9b578c083b8d6e975b378f9f680d48d53e2f8a8c
last_mapped_at: 2026-10-25
---

# Technology Stack

**Analysis Date:** 2026-10-25

## Languages

**Primary:**

- TypeScript 6.0.3 - All application and test source under `src/` and `test/`

**Secondary:**

- JavaScript (ESM) - Emitted output in `dist/` run directly via `node dist/main` (`start:prod`)
- YAML - Bruno API tests under `test/api/`, CI workflows under `.github/workflows/`
- SQL/T-SQL - Migrations under `src/database/migrations/`

## Runtime

**Environment:**

- Node.js 26.10.0 (declared in `package.json` `devEngines` and `mise.toml`)

**Package Manager:**

- pnpm 12.8.2 (`packageManager` field, `pnpm-workspace.yaml`)
- Lockfile: `pnpm-lock.yaml` present (frozen installs in CI)

## Frameworks

**Core:**

- NestJS 12.2.0 (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`) - HTTP API framework
- `@nestjs/config` 12.0.1 - Environment configuration (`ConfigModule` global in `src/app.module.ts`)
- `@nestjs/typeorm` 12.0.2 - TypeORM integration
- `@nestjs/mapped-types` * - DTO mapping helpers
- Express 5 (via `@nestjs/platform-express`) - HTTP server
- RxJS 7.8.2 - NestJS peer dependency

**Testing:**

- Vitest 5.0.5 - Test runner with three projects (UNIT/E2E/FEATURE) in `vitest.config.ts`
- `@amiceli/vitest-cucumber` 8.0.0 - Gherkin/Cucumber feature specs
- `@suites/unit` 3.1.1, `@suites/di.nestjs` 3.1.0, `@suites/doubles.vitest` 3.1.0 - Unit test DI helpers
- `@nestjs/testing` 12.2.0 - NestJS test module
- Supertest 7.3.1 - HTTP assertions
- Pactum 3.9.1 - API/feature HTTP client
- `@testcontainers/mssqlserver` 12.2.1 - MSSQL Testcontainers for E2E
- `@faker-js/faker` 10.6.0 - Test data
- `@vitest/coverage-v8` 5.0.5 - Coverage

**Build/Dev:**

- `@nestjs/cli` 12.0.10 / `@nestjs/schematics` 12.0.10 - Build (`nest build`) and scaffolding
- ttsc 0.32.0 - TypeScript transform for TypeORM CLI (`node --require ttsc/register`)
- TypeScript 6.0.3 - Compiler (`tsc` via `pnpm ttsc`)
- oxlint 1.89.0 - Linter (`pnpm lint`, config `.oxlintrc.json`)
- Prettier 3.9.10 - Formatter (`.prettierrc`)
- `source-map-support` 0.5.21 - Stack traces

## Key Dependencies

**Critical:**

- `typeorm` 1.1.2 - ORM (Data Mapper, migrations, seeders)
- `mssql` 12.7.11 - SQL Server driver
- `class-validator` 0.15.1 - DTO validation (integrated with NestJS via `useContainer`)
- `class-transformer` 0.5.1 - Serialization/transformation
- `reflect-metadata` 0.2.2 - Decorator metadata (required by NestJS/TypeORM)
- `@rapiq/core` 2.4.0, `@rapiq/adapter-typeorm` 2.4.0, `@rapiq/codec-url` 2.4.0 - Query parsing/filtering/sorting/pagination over TypeORM (`src/shared/interceptors/pagination.interceptor.ts`, `src/shared/providers/schema-registry.provider.ts`)
- `typeorm-extension` 4.3.0 - Seeders/factories/migrations CLI

**Infrastructure:**

- `@nestjs/config` - Env var loading
- `node-mocks-http` 1.18.1 - HTTP mocking in tests

## Configuration

**Environment:**

- Configured via environment variables loaded by `ConfigModule.forRoot({ isGlobal: true, expandVariables: true })` (`src/app.module.ts`)
- Required vars: `MSSQL_PASSWORD` (or `MSSQL_SA_PASSWORD` when `MSSQL_USER=sa`), optional `MSSQL_HOST`, `MSSQL_PORT`, `MSSQL_DB`, `MSSQL_USER`, `PORT`, `CI`
- Database config factory: `src/config/typeorm.ts` (registered as `typeorm` namespace)
- TypeORM CLI data source: `data-source.ts` (reads env, loads entities/migrations/seeds/factories)
- `.env` file present (gitignored; values not committed)
- `mise.toml` provides encrypted env values (age) and tool versions

**Build:**

- `nest-cli.json` - sourceRoot `src`, deleteOutDir
- `tsconfig.json` - strict, ESNext, nodenext modules, decorators, outDir `./dist`
- `tsconfig.build.json` - extends base, rootDir `./src`, excludes tests
- `vitest.config.ts` - three test projects (UNIT/E2E/FEATURE)

## Platform Requirements

**Development:**

- Node 26.10.0, pnpm 12.8.2 (via mise)
- Docker daemon (E2E tests spin up MSSQL Testcontainer; devcontainer provides SQL Server service)
- MSSQL 2025 (CI service image `mcr.microsoft.com/mssql/server:2025-latest`) or 2022 (`mcr.microsoft.com/mssql/server:2022-latest` in E2E Testcontainer)

**Production:**

- Distroless Node.js 26 image (`gcr.io/distroless/nodejs26-debian13`) running `main.js`
- Kubernetes manifests under `k8s/`
- GitHub Container Registry (`ghcr.io`) image publishing
- Default port 3000 (configurable via `PORT`)

---

_Stack analysis: 2026-10-25_
