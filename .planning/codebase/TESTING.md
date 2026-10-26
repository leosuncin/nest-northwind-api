---
last_mapped_commit: 9b578c083b8d6e975b378f9f680d48d53e2f8a8c
last_mapped_at: 2026-10-25
---

# Testing Patterns

**Analysis Date:** 2026-10-25

## Test Framework

**Runner:**

- Vitest 5.0.5 with three projects defined in `vitest.config.ts`: `UNIT`, `E2E`, `FEATURE`
- Shared config: `globals: true`, `environment: 'node'`, `tsconfigPaths: true`, coverage provider `v8`
- Config file: `vitest.config.ts`

**Assertion Library:**

- Vitest `expect` (Jest-compatible): `toEqual`, `toHaveBeenCalledWith`, `toMatchInlineSnapshot`, `toMatchObject`, `toHaveProperty`, `toThrow`, `toHaveLength`

**Run Commands:**

```bash
pnpm test                                 # UNIT project only
pnpm test:cov                             # all projects with coverage
pnpm test:watch                           # watch mode
pnpm test:e2e                             # E2E project (Docker required)
pnpm test:debug                           # inspect-brk, no parallelism
vitest run --project FEATURE              # feature specs (API must be running)
pnpm exec vitest run --project UNIT src/category/services/category.service.spec.ts
pnpm exec vitest run --project UNIT src/category/services/category.service.spec.ts -t "test name"
```

## Test File Organization

**Location:**

- Unit specs colocated: `src/**/*.spec.ts`
- E2E specs: `test/e2e/*.e2e-spec.ts`
- Feature specs: `test/features/*.feature-spec.ts` + matching `.feature` Gherkin
- API tests: `test/api/**/*.yml` (Bruno OpenCollection)

**Naming:**

- `<name>.spec.ts` (unit), `<domain>.e2e-spec.ts` (E2E), `<domain>.feature-spec.ts` (feature)

**Structure:**

```
src/
  category/
    services/category.service.spec.ts
    controllers/category.controller.spec.ts
    pipes/category.pipe.spec.ts
    validators/is-existing-category.validator.spec.ts
test/
  e2e/category.e2e-spec.ts
  e2e/extend-test.ts
  e2e/global-setup.ts
  features/category.feature
  features/category.feature-spec.ts
```

## Test Structure

**Suite Organization:**

```ts
import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.vitest';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Mocked<Repository<Category>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(CategoryService).compile();
    service = unit;
    repository = unitRef.get(
      getRepositoryToken(Category) as string,
    ) as unknown as Mocked<Repository<Category>>;
  });

  test('given a valid dto when create then it persists and returns the category', async () => {
    repository.create.mockReturnValue(createdCategory);
    repository.save.mockResolvedValue(createdCategory);

    const category = await service.create(createCategory);

    expect(category).toEqual(createdCategory);
    expect(repository.create).toHaveBeenCalledWith(createCategory);
    expect(repository.save).toHaveBeenCalledWith(createdCategory);
  });
});
```

**Patterns:**

- `test()` in most unit specs; `it()` in validator specs
- Test names follow `given ... when ... then ...`
- AAA style with inline mock setup per test
- `void service.exists.mockResolvedValue(...)` to satisfy floating-promise lint
- Fixtures cast with `as Category` / `as unknown as ...`
- Inline snapshots (`toMatchInlineSnapshot`) for exact output
- `satisfies` for type-checked literals in E2E

## Mocking

**Framework:** `@suites/doubles.vitest` (`mock`, `Mocked`) + `@suites/unit` (`TestBed`); `@nestjs/testing` for validators and E2E.

**Unit patterns:**

```ts
const { unit, unitRef } = await TestBed.solitary(CategoryService).compile();
repository = unitRef.get(
  getRepositoryToken(Category) as string,
) as unknown as Mocked<Repository<Category>>;
repository.create.mockReturnValue(createdCategory);
repository.save.mockResolvedValue(createdCategory);
```

**Mock overrides:**

```ts
await TestBed.solitary(PaginationInterceptor)
  .mock(Reflector)
  .impl(() => ({
    getAllAndOverride() {
      return 'fixture';
    },
  }))
  .mock(SchemaRegistry)
  .final(registry)
  .compile();
```

**Validator specs** use `Test.createTestingModule` with `useFactory: mock` and `useContainer(module, { fallbackOnErrors: true })`.

**HTTP layer mocking:** `node-mocks-http` `createMocks` for filters/interceptors/pipes.

**What to Mock:** repositories, services, `Reflector`, `SchemaRegistry`, HTTP req/res.

**What NOT to Mock:** E2E uses a real MSSQL Testcontainer + full app; feature tests hit a running API.

## Fixtures and Factories

**Test Data:**

- Unit: inline object literals cast `as Category`
- E2E: `useSeederFactory(Category).save({ name: 'Junk food' })`
- Seeders: JSON fixtures under `src/database/seeds/*.json` (e.g. `category.json`)
- Factories use `@faker-js/faker` via `setSeederFactory` (`src/database/factories/*.factory.ts`)

**Location:**

- `src/database/factories/`, `src/database/seeds/`

## Coverage

**Requirements:** None enforced (no thresholds configured).

**View Coverage:**

```bash
pnpm test:cov
```

Provider: `v8` (`@vitest/coverage-v8`).

## Test Types

**Unit Tests:**

- Scope: services, controllers, pipes, validators, filters, interceptors, app controller
- Approach: solitary unit tests with mocked dependencies via Suites `TestBed`

**Integration Tests:**

- Not a separate project; E2E covers HTTP + database

**E2E Tests:**

- Vitest + Supertest against the full Nest app
- Global setup (`test/e2e/global-setup.ts`) starts an MSSQL Testcontainer, runs migrations and seeders
- `test/e2e/extend-test.ts` extends vitest `test` with an `app` fixture (scope: file)
- Parameterized cases via `test.for([...])`
- Timeouts: `testTimeout`/`hookTimeout` 60s

**Feature Tests:**

- `@amiceli/vitest-cucumber` + Pactum against a running API (requires server + DB + `PACTUM_REQUEST_BASE_URL`)
- Gherkin `.feature` files + `.feature-spec.ts` step bindings

**API Tests:**

- Bruno OpenCollection YAML under `test/api/`; run via `mise test-api`

## Common Patterns

**Async Testing:**

```ts
const result = await firstValueFrom(
  interceptor.intercept(buildContext(5, (2 - 1) * 5), {
    handle: () => of([items, totalItems]),
  }),
);
```

**Error Testing:**

```ts
expect(() => pipe.transform(0)).toThrow(BadRequestException);
```

**HTTP assertions (E2E):**

```ts
await request(app.getHttpServer())
  .post('/category')
  .send(newCategory)
  .expect(HttpStatus.CREATED)
  .expect('Content-Type', /json/);
```

**Validator snapshot:**

```ts
expect(errors[0].constraints).toMatchInlineSnapshot(`
  {
    "IsExistingCategory": "Category with id 1 does not exist",
  }
`);
```

---

_Testing analysis: 2026-10-25_
