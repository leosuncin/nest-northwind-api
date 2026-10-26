---
last_mapped_commit: 9b578c083b8d6e975b378f9f680d48d53e2f8a8c
last_mapped_at: 2026-10-25
---

# Codebase Structure

**Analysis Date:** 2026-10-25

## Directory Layout

```text
nest-northwind-api/
├── src/
│   ├── app.module.ts            # Composition root
│   ├── main.ts                  # Bootstrap
│   ├── app.controller.ts / app.service.ts
│   ├── config/
│   │   └── typeorm.ts           # Env-driven TypeORM options
│   ├── shared/                  # Cross-cutting filters/interceptors/pipes/providers/utils
│   ├── <domain>/                # category, customer, employee, order, product, shipper, supplier
│   │   ├── <domain>.module.ts
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── pipes/
│   │   ├── services/
│   │   └── validators/
│   │   └── interceptors/       # customer only
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeds/
│   └── vitest-globals.d.ts
├── test/
│   ├── e2e/                    # Docker-backed E2E specs
│   ├── features/               # Pactum/Cucumber feature specs + .feature files
│   └── api/                    # Bruno OpenCollection YAML tests
├── data-source.ts              # TypeORM CLI data source
├── tsconfig.json / tsconfig.build.json
├── nest-cli.json
└── vitest.config.ts
```

## Directory Purposes

**`src/`:**

- Purpose: Application source code.
- Contains: Modules, controllers, services, entities, DTOs, pipes, validators, shared utilities, database assets.
- Key files: `src/main.ts`, `src/app.module.ts`.

**`src/<domain>/`:**

- Purpose: One business domain (category, customer, employee, order, product, shipper, supplier).
- Contains: Module, controllers, DTOs, entities, pipes, services, validators; `interceptors/` for customer.
- Key files: `<domain>.module.ts`, `controllers/<domain>.controller.ts`, `services/<domain>.service.ts`, `entities/<domain>.entity.ts`.

**`src/shared/`:**

- Purpose: Cross-domain reusable components.
- Contains: `filters/`, `interceptors/`, `pipes/`, `providers/`, `utils/`.
- Key files: `shared.module.ts`, `filters/entity-not-found.filter.ts`, `interceptors/pagination.interceptor.ts`, `providers/schema-registry.provider.ts`.

**`src/config/`:**

- Purpose: Configuration factories.
- Contains: `typeorm.ts`.
- Key files: `src/config/typeorm.ts`.

**`src/database/`:**

- Purpose: Schema migrations, seed data, and test factories.
- Contains: `migrations/`, `seeds/`, `factories/`.
- Key files: `src/database/seeds/*.seeder.ts`, `src/database/migrations/*.ts`.

**`test/e2e/`:**

- Purpose: Docker-backed end-to-end tests.
- Contains: `*.e2e-spec.ts`, `global-setup.ts`, `helpers.ts`, `extend-test.ts`.
- Key files: `test/e2e/global-setup.ts`.

**`test/features/`:**

- Purpose: Pactum/Cucumber feature tests and Gherkin feature files.
- Contains: `*.feature`, `*.feature-spec.ts`.

**`test/api/`:**

- Purpose: Bruno OpenCollection API tests (YAML).
- Contains: Per-domain folders and environments.

**`dist/`:**

- Purpose: Compiled ESM output.
- Contains: Built JavaScript mirroring `src/`.
- Generated: Yes (`nest build`).
- Committed: No (gitignored).

## Key File Locations

**Entry Points:**

- `src/main.ts`: Application bootstrap.
- `src/app.module.ts`: Composition root.
- `data-source.ts`: TypeORM CLI data source.

**Configuration:**

- `src/config/typeorm.ts`: Runtime TypeORM options.
- `tsconfig.json`, `tsconfig.build.json`: TypeScript config.
- `nest-cli.json`: Nest CLI config.
- `vitest.config.ts`: Test projects (UNIT/E2E/FEATURE).

**Core Logic:**

- `src/<domain>/services/*.service.ts`: Domain services.
- `src/<domain>/controllers/*.controller.ts`: HTTP controllers.
- `src/shared/interceptors/pagination.interceptor.ts`: Query parsing + pagination envelope.

**Testing:**

- `src/**/*.spec.ts`: Colocated unit tests.
- `test/e2e/*.e2e-spec.ts`: E2E tests.
- `test/features/*.feature-spec.ts`: Feature tests.

## Naming Conventions

**Files:**

- Domain modules: `<domain>.module.ts` (e.g., `category.module.ts`).
- Controllers: `<domain>.controller.ts` (or `<entity>.controller.ts` for order-detail).
- Services: `<domain>.service.ts`.
- Entities: `<domain>.entity.ts` (singular).
- DTOs: `create-<domain>.dto.ts`, `update-<domain>.dto.ts`, `query-<domain>.dto.ts`.
- Pipes: `<domain>.pipe.ts`.
- Validators: `is-existing-<domain>.validator.ts`.
- Specs: `*.spec.ts` (unit), `*.e2e-spec.ts` (E2E), `*.feature-spec.ts` (feature).
- Migrations: `<timestamp>-<description>.ts`.
- Seeders: `<domain>.seeder.ts`; factories: `<domain>.factory.ts`.

**Directories:**

- Domain folders are singular nouns (`category`, `customer`, `order`).
- Subfolders are plural functional groups (`controllers`, `dto`, `entities`, `pipes`, `services`, `validators`).

**Classes:**

- PascalCase for classes/interfaces; services/controllers/modules suffixed (`CategoryService`, `CategoryController`).
- DTO classes use action nouns (`CreateCategory`, `UpdateCategory`).

## Where to Add New Code

**New Feature (domain):**

- Create folder `src/<domain>/` with subfolders `controllers`, `dto`, `entities`, `pipes`, `services`, `validators`.
- Register module in `src/app.module.ts` imports.
- Add TypeORM migration in `src/database/migrations/`.
- Add seeder/factory if needed in `src/database/`.
- Unit tests colocated as `*.spec.ts`; E2E in `test/e2e/`.

**New endpoint on existing domain:**

- Add handler in `src/<domain>/controllers/<domain>.controller.ts`.
- Add service method in `src/<domain>/services/<domain>.service.ts`.
- Add DTO in `src/<domain>/dto/` if new payload.
- Add pipe in `src/<domain>/pipes/` if entity resolution needed.

**New shared utility:**

- Place in `src/shared/utils/` or appropriate `src/shared/<type>/`.

**New cross-cutting interceptor/filter/pipe:**

- Place in `src/shared/<type>/` and register in `src/shared/shared.module.ts` if needed.

## Special Directories

**`src/database/migrations/`:**

- Purpose: TypeORM migration files.
- Generated: No (hand-written).
- Committed: Yes.

**`src/database/seeds/` and `factories/`:**

- Purpose: Seed data and test factories.
- Generated: No.
- Committed: Yes.

**`dist/`:**

- Purpose: Compiled output.
- Generated: Yes.
- Committed: No.

**`test/api/`:**

- Purpose: Bruno API collection.
- Generated: No.
- Committed: Yes.

---

_Structure analysis: 2026-10-25_
