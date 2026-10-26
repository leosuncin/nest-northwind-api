---
last_mapped_commit: 9b578c083b8d6e975b378f9f680d48d53e2f8a8c
last_mapped_at: 2026-10-25
---

# Coding Conventions

**Analysis Date:** 2026-10-25

## Naming Patterns

**Files:**

- kebab-case for all source files: `category.service.ts`, `is-existing-category.validator.ts`, `entity-not-found.filter.ts`, `positive-int.pipe.ts`, `money-transformer.ts`
- Unit specs colocated as `*.spec.ts`; E2E as `*.e2e-spec.ts`; feature specs as `*.feature-spec.ts`
- DTO files: `create-<domain>.dto.ts`, `update-<domain>.dto.ts`, `query-<domain>.dto.ts`
- No barrel/index files; import the concrete file directly

**Classes/Types:**

- PascalCase: `CategoryService`, `CategoryController`, `CategoryPipe`, `CategoryModule`, `CreateCategory`, `UpdateCategory`
- Validator constraint + decorators: `IsExistingCategoryConstraint` plus `IsExistingCategory` / `IsNotExistingCategory`
- Interfaces: PascalCase, often generic (`Pagination<I>`); external uses `IQuery`, `IQuery`-style
- Generic type params: descriptive (`Item`, `E`) or single letter

**Functions:**

- camelCase verbs: `findAll`, `findOne`, `create`, `update`, `remove`, `exists`
- Transform/filter hooks: `transform`, `intercept`, `catch`, `validate`, `defaultMessage`
- Utilities: `isId`, `roundDateToDay`, `toSentenceCase`

**Variables:**

- camelCase; repositories named `<domain>Repository` (`categoryRepository`)
- Constructor params `private readonly ...`
- DTO fields use `readonly name!: string` (definite assignment); optionals `readonly description?: string`
- Entity columns camelCase with DB mapping via `@JoinColumn({ name: 'supplierId' })`

**DTO class naming:** no `Dto` suffix (`CreateCategory`, not `CreateCategoryDto`).

## Code Style

**Formatting:**

- Prettier 3.9.10 with `.prettierrc`: `singleQuote: true`, `trailingComma: 'all'`
- EditorConfig (`.editorconfig`): 2 spaces, LF, UTF-8, trim trailing whitespace, final newline, tab width 2
- Run `pnpm format` to write; check with `npx prettier --check "src/**/*.ts" "test/**/*.ts"`

**Linting:**

- oxlint 1.89.0 (`pnpm lint` = `oxlint src/ test/`), config `.oxlintrc.json`
- Extends `@ogs-gmbh/oxlint-presets`: `oxc-recommended`, `node-recommended`, `promise-recommended`
- Plugins: `node`, `promise`
- Overridden rules: `@typescript-eslint/no-explicit-any` off; `@typescript-eslint/no-floating-promises` warn
- Inline disables: `// oxlint-disable-next-line ...`

**TypeScript:**

- `tsconfig.json`: `strict: true`, `module: nodenext`, `isolatedModules: true`, `experimentalDecorators` + `emitDecoratorMetadata`
- ESM package (`"type": "module"`): relative imports MUST include `.js` extension (`'../entities/category.entity.js'`)
- Type-only imports use `import type` (`import type { Repository } from 'typeorm'`)
- `ignoreDeprecations: 6.0` for TS 6

## Import Organization

**Order (observed):**

1. Node built-ins when used (`import { ok } from 'node:assert/strict'`)
2. External packages (`@nestjs/*`, `typeorm`, `@rapiq/*`, `@faker-js/faker`)
3. Blank line
4. Relative imports (shared first, then domain-local), all with `.js`

- Type-only imports from packages are placed after value imports within the external block (e.g. `import type { IQuery } from '@rapiq/core'`)

**Path Aliases:** None configured. Use relative paths only.

**Example (`src/category/controllers/category.controller.ts`):**

```ts
import { Body, Controller, ... } from '@nestjs/common';
import type { IQuery } from '@rapiq/core';

import { EntityNotFoundFilter } from '../../shared/filters/entity-not-found.filter.js';
import { CreateCategory } from '../dto/create-category.dto.js';
```

## Error Handling

**Strategy:** Delegate to NestJS exception classes + a single domain filter; rely on TypeORM's `*OrFail` to raise `EntityNotFoundError`.

**Patterns:**

- `EntityNotFoundFilter` (`src/shared/filters/entity-not-found.filter.ts`) catches `EntityNotFoundError` and responds `404` with `{ statusCode, message, why }`. Registered per controller via `@UseFilters(EntityNotFoundFilter)`.
- Services use `findOneByOrFail` / `findOneOrFail` (e.g. `CategoryService.findOne`, `OrderService.findOne`) so missing entities throw `EntityNotFoundError`.
- Pipes throw `BadRequestException` for invalid input: `PositiveIntPipe` (`src/shared/pipes/positive-int.pipe.ts`), `OrderDetailPipe` (`src/order/pipes/order-detail.pipe.ts`).
- `PaginationInterceptor` (`src/shared/interceptors/pagination.interceptor.ts`) throws `BadRequestException` with `{ errors, message, why }` on parse errors.
- DTO validation via `ValidationPipe({ transform: true, whitelist: true })` → 400 on invalid payload.
- No `Logger`/`console` usage in `src/`; no global exception filter. Floating promises are only a warning (oxlint).

## Logging

**Framework:** None in `src/`. NestJS `Logger` is the recommended approach if logging is added (see `nestjs-best-practices` skill). `console.*` is not used in application code.

## Comments

**When to Comment:**

- Minimal; code is self-documenting
- `@ts-expect-error` for intentional type bypasses (e.g. pagination interceptor)
- Inline oxlint disables where needed
- `satisfies` for type-checked literals (mostly in tests)

**JSDoc/TSDoc:** Not used anywhere in `src/`.

## Function Design

**Size:** Small, single-purpose methods; services expose ~5 methods (`create`, `findAll`, `findOne`, `update`, `remove`, optional `exists`).

**Parameters:**

- DTOs passed as a single object; entity passed where needed for `update`/`remove`
- Id types use indexed access: `id: Category['id']`
- Pipe `transform(value, metadata)` follows NestJS `PipeTransform`

**Return Values:**

- Services return repository promises directly (often un-awaited): `return this.categoryRepository.save(category);`
- Controllers return the service result directly
- `async` only where `await` is needed (e.g. `exists`)

## Module Design

**Exports:**

- Domain modules export their service + validator constraint (e.g. `CategoryModule` exports `CategoryService`, `IsExistingCategoryConstraint`)
- Controllers are not exported
- `SharedModule.forFeature(...schemas)` is a dynamic module registering `SchemaRegistry` providers

**Barrel Files:** None. Always import the concrete file.

**Decorators/Patterns:**

- `@Injectable()`, `@Controller('domain')`, `@Entity()`, `@Module({...})`
- DTOs use `class-validator` decorators (`@IsDefined`, `@IsString`, `@MaxLength`, ...)
- `Update<Domain> extends PartialType(Create<Domain>)` (via `@nestjs/mapped-types`)
- Entity columns use TypeORM decorators; `moneyTransformer` for `money` columns
- Controllers consistently: `@UseFilters(EntityNotFoundFilter)`, `@UseInterceptors(ClassSerializerInterceptor)`, `@SetMetadata('schema', ...)`, `@UseInterceptors(PaginationInterceptor)` on `findAll`

---

_Convention analysis: 2026-10-25_
