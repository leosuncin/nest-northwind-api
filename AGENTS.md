# Repository Guide

## Ground Truth

- This is one pnpm package despite `pnpm-workspace.yaml`; use pnpm 12.3.4 and Node 26.
- `README.md` is mostly unmodified Nest.js starter text. Prefer `package.json`, `vitest.config.ts`, and `.github/workflows/ci.yml` when it disagrees with the repository.
- The package is ESM. Keep `.js` extensions on relative imports in TypeScript; emitted files run directly from `dist`.
- [Mise](mise.jdx.dev/llms.txt) is used to install CLI tools
- This project use [nest.js](https://docs.nestjs.com/llms.txt) framework to build and API

## Verification

- Install with `pnpm install --frozen-lockfile`.
- Match CI's fast checks in this order: `npx prettier --check "src/**/*.ts" "test/**/*.ts"`, `pnpm lint`, `pnpm ttsc --noEmit`, then `pnpm build`.
- `pnpm format` writes formatting; it is not a check. There is no `typecheck` script, so use `pnpm ttsc --noEmit` directly.
- Git hooks are managed with [hk](hk.jdx.dev/llms.txt) which integrates with mise, checks can be run `hk check`
- Run unit tests with `pnpm test`. Focus one file with `pnpm exec vitest run --project UNIT src/category/services/category.service.spec.ts`; add `-t "test name"` to focus a case.
- Run one E2E file with `pnpm exec vitest run --project E2E test/e2e/category.e2e-spec.ts`. E2E tests require a working Docker daemon: each file starts its own MSSQL Testcontainer, runs migrations, and reseeds before each test.

## Database And API Tests

- Runtime and TypeORM CLI default to MSSQL at `localhost:1433`, database `northwind`, user `instnwnd`. Set `MSSQL_PASSWORD`; when `MSSQL_USER=sa`, set `MSSQL_SA_PASSWORD` instead. `synchronize` is intentionally disabled.
- Run schema and fixtures with `pnpm typeorm migration:run` followed by `pnpm typeorm-extension seed:run`. The CLI reads `data-source.ts`; migrations, seeders, and factories live under `src/database/`.
- Feature tests are not covered by a package script and are not self-contained. Follow CI: migrate and seed MSSQL, build and start the API with `pnpm start:prod`, set `PACTUM_REQUEST_BASE_URL` (normally `http://127.0.0.1:3000`), then run `pnpm exec vitest run --project FEATURE`.
- API tests are written with Bruno's OpenCollective format using YAML files, tests live under `test/api` and to run them `mise test-api`. For futher more context https://raw.githubusercontent.com/bruno-collections/ai-assistant-prompts/refs/heads/main/prompts/general/bruno-ai-context.md

## Structure

- `src/app.module.ts` is the composition root. Domain modules (`category`, `customer`, `employee`, `order`, `product`, `shipper`, `supplier`) own controllers, services, DTOs, entities, pipes, and validators; cross-domain filters, interceptors, pipes, and providers belong in `src/shared/`.
- Unit specs are colocated under `src/**/*.spec.ts`; Docker-backed E2E specs are under `test/e2e/`; Pactum/Cucumber feature specs are under `test/features/`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
