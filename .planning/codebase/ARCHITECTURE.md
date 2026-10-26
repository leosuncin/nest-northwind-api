---
last_mapped_commit: 9b578c083b8d6e975b378f9f680d48d53e2f8a8c
last_mapped_at: 2026-10-25
---

<!-- refreshed: 2026-10-25 -->

# Architecture

**Analysis Date:** 2026-10-25

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      HTTP / Express Layer                    │
│   Controllers (`src/**/controllers/*.controller.ts`)          │
├──────────────────┬──────────────────┬───────────────────────┤
│   Domain Modules │   Shared Module  │   App Module          │
│  `src/<domain>/` │ `src/shared/`    │ `src/app.module.ts`   │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
│         `src/<domain>/services/*.service.ts`                │
└────────────────────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              TypeORM Repositories / Entities                 │
│   `src/<domain>/entities/*.entity.ts` + @InjectRepository   │
└────────────────────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              MSSQL (northwind database)                      │
│   Migrations/seeds: `src/database/`                         │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component              | Responsibility                                                             | File                                                 |
| ---------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------- |
| App composition root   | Wires global config, TypeORM, and all domain modules                       | `src/app.module.ts`                                  |
| Bootstrap              | Creates Nest app, enables class-validator container, listens on `PORT`     | `src/main.ts`                                        |
| Domain module          | Registers entity repository, query schema, controller, service, validators | `src/<domain>/<domain>.module.ts`                    |
| Controller             | HTTP routing, validation, serialization, pagination metadata               | `src/<domain>/controllers/*.controller.ts`           |
| Service                | CRUD and query execution via TypeORM + rapiq adapter                       | `src/<domain>/services/*.service.ts`                 |
| Entity                 | TypeORM schema mapping to MSSQL tables                                     | `src/<domain>/entities/*.entity.ts`                  |
| Query schema           | Declares allowed fields/filters/sorts/pagination for rapiq                 | `src/<domain>/dto/query-*.dto.ts`                    |
| Entity pipe            | Loads a persisted entity by id for update/delete routes                    | `src/<domain>/pipes/*.pipe.ts`                       |
| Existence validator    | Async class-validator constraint backed by service.exists()                | `src/<domain>/validators/is-existing-*.validator.ts` |
| Pagination interceptor | Decodes URL query into rapiq `IQuery`, shapes `{ items, meta }`            | `src/shared/interceptors/pagination.interceptor.ts`  |
| Not-found filter       | Maps TypeORM `EntityNotFoundError` to HTTP 404                             | `src/shared/filters/entity-not-found.filter.ts`      |
| Schema registry        | Registers rapiq schemas per module                                         | `src/shared/providers/schema-registry.provider.ts`   |
| Shared module          | Dynamic module exporting `SchemaRegistry`                                  | `src/shared/shared.module.ts`                        |

## Pattern Overview

**Overall:** Modular NestJS application with domain-oriented modules, TypeORM repositories, and rapiq-driven filtering/sorting/pagination.

**Key Characteristics:**

- Each business domain is a self-contained NestJS module exporting its service and existence validator.
- Controllers are thin: they delegate to services and rely on pipes/interceptors/filters for cross-cutting concerns.
- List endpoints use rapiq (`@rapiq/core`, `@rapiq/adapter-typeorm`, `@rapiq/codec-url`) to translate URL query parameters into TypeORM query builder calls.
- Entities are loaded by id through domain pipes before update/delete, so services operate on managed entities.
- Validation uses `class-validator`/`class-transformer` with `ValidationPipe({ transform: true, whitelist: true })`.
- Database schema is managed by TypeORM migrations; `synchronize` is disabled.

## Layers

**HTTP / Controller Layer:**

- Purpose: Route requests, validate input, serialize output, attach pagination.
- Location: `src/<domain>/controllers/*.controller.ts`
- Contains: Route handlers, `@UseFilters`, `@UseInterceptors`, `@UsePipes`, `@SetMetadata('schema', ...)`.
- Depends on: Services, pipes, shared filters/interceptors.
- Used by: Express/Nest runtime.

**Service Layer:**

- Purpose: Domain operations (create/read/update/delete) and query execution.
- Location: `src/<domain>/services/*.service.ts`
- Contains: Repository injection, CRUD methods, `findAll` with `TypeormAdapter`.
- Depends on: TypeORM repositories, DTOs, entities.
- Used by: Controllers, pipes, validators (via DI).

**Persistence Layer:**

- Purpose: ORM mapping and database access.
- Location: `src/<domain>/entities/*.entity.ts`, `src/database/migrations/*.ts`, `src/database/seeds/*.seeder.ts`
- Contains: Entity decorators, migrations, seeders/factories.
- Depends on: TypeORM, MSSQL.
- Used by: Services via `@InjectRepository`.

**Shared / Cross-Cutting Layer:**

- Purpose: Reusable filters, interceptors, pipes, providers, utilities.
- Location: `src/shared/`
- Contains: `EntityNotFoundFilter`, `PaginationInterceptor`, `PositiveIntPipe`, `SchemaRegistry` providers, utils, money transformer.
- Depends on: NestJS, rapiq, TypeORM.
- Used by: All domain modules.

**Configuration Layer:**

- Purpose: Environment-driven TypeORM options and data source for CLI.
- Location: `src/config/typeorm.ts`, `data-source.ts`
- Contains: `registerAs('typeorm', ...)`, CLI `DataSource` with migrations/seeds/factories.
- Depends on: Environment variables.
- Used by: `AppModule`, TypeORM CLI, E2E global setup.

## Data Flow

### Primary Request Path (CRUD)

1. Request enters Express and Nest routing (`src/main.ts` bootstrap).
2. Controller handler invoked (`src/<domain>/controllers/*.controller.ts`).
3. Input validated/transformed by `ValidationPipe` and domain pipes (`src/<domain>/pipes/*.pipe.ts`).
4. Service method executes CRUD (`src/<domain>/services/*.service.ts`).
5. Repository persists/reads against MSSQL; `EntityNotFoundError` thrown on missing records.
6. `EntityNotFoundFilter` converts to HTTP 404 when applicable; `ClassSerializerInterceptor` serializes response.

### List / Query Path

1. `PaginationInterceptor` intercepts GET list (`src/shared/interceptors/pagination.interceptor.ts`).
2. URL decoded into rapiq `IQuery` using schema from `SchemaRegistry` (`@SetMetadata('schema', ...)`).
3. Decoded query assigned to `request.query`.
4. Service `findAll` builds `QueryBuilder` and runs `TypeormAdapter.execute(filters)` (`src/<domain>/services/*.service.ts`).
5. Repository returns `[items, totalItems]`.
6. Interceptor shapes `{ items, meta }` response.

### Startup Path

1. `NestFactory.create(AppModule)` (`src/main.ts`).
2. `ConfigModule.forRoot` loads env; `TypeOrmModule.forRootAsync(typeormOptions.asProvider())` connects to MSSQL with `autoLoadEntities: true`.
3. Domain modules register repositories and rapiq schemas via `SharedModule.forFeature(...)`.
4. `useContainer(app.select(AppModule), { fallbackOnErrors: true })` enables class-validator DI.
5. `app.listen(process.env.PORT ?? 3000)`.

### CLI / Migration Path

1. `pnpm typeorm` runs `data-source.ts` (`src/database/migrations/*.ts`, seeds, factories).
2. `pnpm typeorm-extension seed:run` executes seeders (`src/database/seeds/*.seeder.ts`).

## Key Abstractions

**Domain Module:**

- Purpose: Encapsulates one business entity and its HTTP surface.
- Examples: `src/category/category.module.ts`, `src/order/order.module.ts`
- Pattern: `TypeOrmModule.forFeature([Entity])` + `SharedModule.forFeature(querySchema)` + controller/service/validator providers.

**Entity Pipe:**

- Purpose: Resolve route param/body references to persisted entities before service calls.
- Examples: `src/category/pipes/category.pipe.ts`, `src/order/pipes/order.pipe.ts`, `src/order/pipes/order-detail.pipe.ts`
- Pattern: Call `service.findOne(id)` for param type; mutate object when `category`/etc. key present.

**Existence Validator:**

- Purpose: Reusable async validation constraint for DTO fields referencing entities.
- Examples: `src/category/validators/is-existing-category.validator.ts`
- Pattern: `@ValidatorConstraint({ async: true })` + `registerDecorator`; exported `IsExisting*`/`IsNotExisting*`.

**Query Schema:**

- Purpose: Whitelist fields, filters, sorts, and pagination limits for rapiq.
- Examples: `src/category/dto/query-category.dto.ts`, `src/order/dto/query-order.dto.ts`
- Pattern: `defineSchema<Entity>({ name, fields, filters, sorts, pagination })`.

**Pagination Envelope:**

- Purpose: Standard list response with metadata.
- Examples: `src/shared/interceptors/pagination.interceptor.ts`
- Pattern: `{ items, meta: { itemCount, totalItems, itemsPerPage, totalPages, currentPage, hasNextPage, hasPreviousPage } }`.

## Entry Points

**Application server:**

- Location: `src/main.ts`
- Triggers: `pnpm start` / `pnpm start:prod` (runs `dist/main`).
- Responsibilities: Bootstrap Nest app, listen on port.

**Composition root:**

- Location: `src/app.module.ts`
- Triggers: Imported by bootstrap.
- Responsibilities: Register global config, TypeORM, all domain modules.

**TypeORM CLI data source:**

- Location: `data-source.ts`
- Triggers: `pnpm typeorm`, `pnpm typeorm-extension`.
- Responsibilities: Provide entities, migrations, seeds, factories to CLI.

**E2E test bootstrap:**

- Location: `test/e2e/global-setup.ts`
- Triggers: Vitest E2E project.
- Responsibilities: Start MSSQL Testcontainer, run migrations, seed data, provide TypeORM options.

## Architectural Constraints

- **ESM modules:** Package is `"type": "module"`; relative imports must use `.js` extensions (`src/**/*.ts`).
- **No schema sync:** `synchronize: false`; schema changes require migrations in `src/database/migrations/`.
- **Auto entity loading:** `autoLoadEntities: true` in app; CLI data source explicitly globs `src/**/*.entity.ts`.
- **Global validation container:** `useContainer(app.select(AppModule), { fallbackOnErrors: true })` in `src/main.ts` enables DI in class-validator constraints.
- **Per-module rapiq schemas:** Each list-capable module calls `SharedModule.forFeature(...)` to register schemas into the shared `SchemaRegistry`.
- **Relation loading inconsistency:** Some services use `relations: { joinAndSelect: true }` (product, order, employee, order-detail); others load none (category, customer, shipper, supplier). `findOne` methods explicitly specify relations where needed.
- **No authentication/authorization:** Controllers have no guards; all endpoints are public.

## Anti-Patterns

### Mutating request body in interceptor

**What happens:** `SetIdInterceptor` assigns `id` into `request.body` during customer update (`src/customer/interceptors/set-id.interceptor.ts`).
**Why it's wrong:** Couples transport mutation to validation flow and bypasses DTO immutability; easy to miss when reordering pipes.
**Do this instead:** Pass id explicitly to service or merge in controller; keep DTOs readonly.

### Inconsistent `exists()` signatures

**What happens:** Most services expose `exists(id)` while `CustomerService.exists({ code, id })` accepts a partial object (`src/customer/services/customer.service.ts`).
**Why it's wrong:** Callers must know per-domain shape; validators cannot be reused uniformly.
**Do this instead:** Standardize on a single `exists(criteria)` signature or split into `existsById`/`existsByCode`.

### Partial relation loading

**What happens:** `findAll` uses `joinAndSelect` for some entities but not others (`src/product/services/product.service.ts` vs `src/category/services/category.service.ts`).
**Why it's wrong:** List responses differ in shape and N+1 risk varies by endpoint.
**Do this instead:** Define relation loading per schema/query consistently and document expected embedded relations.

## Error Handling

**Strategy:** Let TypeORM/Nest propagate; translate specific errors at boundaries.

**Patterns:**

- `EntityNotFoundError` → HTTP 404 via `EntityNotFoundFilter` (`src/shared/filters/entity-not-found.filter.ts`).
- Validation failures → HTTP 400 via `ValidationPipe`.
- rapiq parse failures → `BadRequestException` with formatted issues (`src/shared/interceptors/pagination.interceptor.ts`).
- Missing required env in non-CI → assertion failure at config load (`src/config/typeorm.ts`).

## Cross-Cutting Concerns

**Logging:** No application logger configured; relies on Nest defaults and TypeORM `logging: true` in CLI only.
**Validation:** `class-validator` + `class-transformer` through `ValidationPipe({ transform: true, whitelist: true })`; async validators use Nest DI container.
**Authentication:** Not implemented.

---

_Architecture analysis: 2026-10-25_
