---
last_mapped_commit: 9b578c083b8d6e975b378f9f680d48d53e2f8a8c
last_mapped_at: 2026-10-25
---

# Codebase Concerns

**Analysis Date:** 2026-10-25

## Tech Debt

**Database transport security disabled:**

- Issue: MSSQL connections set `encrypt: false` and `trustServerCertificate: true` in runtime, CLI, E2E, and Kubernetes configuration.
- Files: `src/config/typeorm.ts`, `data-source.ts`, `test/e2e/global-setup.ts`, `k8s/data-source-configmap.yaml`
- Impact: Credentials and data travel unencrypted; production deployments are exposed to MITM attacks.
- Fix approach: Enable `encrypt: true`, provide a trusted CA, and remove `trustServerCertificate: true` outside local development.

**Employee self-reference cardinality:**

- Issue: `Employee.reportsTo` is declared as `@OneToOne`, but Northwind allows many employees to report to one manager.
- Files: `src/employee/entities/employee.entity.ts`
- Impact: Incorrect relational model and misleading generated schema/queries.
- Fix approach: Change the relation to `@ManyToOne(() => Employee)` and add the corresponding migration.

**Product check constraint typo:**

- Issue: The entity check expression contains a stray quote: `@Check(`unitPrice">= 0`)`.
- Files: `src/product/entities/product.entity.ts`
- Impact: The decorator is inconsistent with `src/database/migrations/1783971900000-create-product-table.ts`; enabling `synchronize` would emit invalid DDL.
- Fix approach: Correct the expression to `unitPrice >= 0`.

**Customer update allows primary-key overwrite:**

- Issue: `UpdateCustomer` explicitly allows `id` with `@Allow()`, and `CustomerService.update` merges the DTO into the loaded entity.
- Files: `src/customer/dto/update-customer.dto.ts`, `src/customer/services/customer.service.ts`
- Impact: A client can attempt to change an existing customer's primary key through PATCH.
- Fix approach: Remove `id` from the update DTO and/or explicitly ignore it during merge.

**Fragile entity-not-found response formatting:**

- Issue: `EntityNotFoundFilter` builds its message from every route parameter using `URLSearchParams` and positional replacements.
- Files: `src/shared/filters/entity-not-found.filter.ts`
- Impact: Composite routes produce misleading messages (for example, attributing unrelated `orderId`/`productId` values to a `Customer`), and the parsing logic is hard to maintain.
- Fix approach: Derive the identifier from the exception payload or a route-specific mapping instead of all params.

**Request query mutation in pagination interceptor:**

- Issue: `PaginationInterceptor` redefines `request.query` at runtime and relies on several `@ts-expect-error` suppressions.
- Files: `src/shared/interceptors/pagination.interceptor.ts`
- Impact: Brittle to refactoring and harder to type-check safely.
- Fix approach: Replace mutation with an explicitly typed request/query object or a dedicated DTO.

**Weak identifier validation:**

- Issue: `isId` accepts any string containing digits and any integer, including negatives.
- Files: `src/shared/utils/id.utils.ts`
- Impact: Invalid identifiers can reach services and produce confusing database errors instead of validation failures.
- Fix approach: Require a strictly numeric string (or UUID, depending on entity) and positive integers.

**Wildcard dependency version:**

- Issue: `@nestjs/mapped-types` is pinned to `"*"`.
- Files: `package.json`
- Impact: Future installs may pull a breaking release without notice.
- Fix approach: Pin to a tested version range.

**Test database version drift:**

- Issue: E2E global setup uses SQL Server 2022 (`mcr.microsoft.com/mssql/server:2022-latest`) while CI and Kubernetes use SQL Server 2025.
- Files: `test/e2e/global-setup.ts`, `.github/workflows/ci.yml`, `k8s/sql-server-deployment.yaml`
- Impact: Environment-specific failures can pass locally and fail in CI, or vice versa.
- Fix approach: Align all environments on one SQL Server image tag.

## Known Bugs

**Customer uniqueness validator is property-name dependent:**

- Symptoms: `IsExistingCustomerConstraint` changes behavior based on `args.property === 'code'`.
- Files: `src/customer/validators/is-existing-customer.validator.ts`
- Trigger: Reusing the decorator on a different property or DTO shape.
- Workaround: Keep the decorator only on `code` as currently done.

**Integer pipe does not verify integrality:**

- Symptoms: `PositiveIntPipe` rejects values below 1 but accepts fractional values such as `1.5`.
- Files: `src/shared/pipes/positive-int.pipe.ts`
- Trigger: Passing a non-integer positive number to routes using the pipe.
- Workaround: None in the current code.

**Date rounding uses local time:**

- Symptoms: `roundDateToDay` constructs dates with local-time components.
- Files: `src/shared/utils/date.utils.ts`, `src/database/factories/employee.factory.ts`
- Trigger: Running in environments whose local timezone differs from the database timezone.
- Workaround: Seed data may shift by a day.

**Money transformer rounds on both read and write:**

- Symptoms: Values are rounded to two decimals in both directions.
- Files: `src/shared/utils/money-transformer.ts`
- Trigger: Persisting values with more than two decimals.
- Workaround: Round inputs before persistence, as DTO transforms already do for some fields.

**Order detail routes depend on an unregistered pipe:**

- Symptoms: `OrderDetailPipe` is used in `OrderDetailController` but is not listed in `OrderModule` providers.
- Files: `src/order/controllers/order-detail.controller.ts`, `src/order/pipes/order-detail.pipe.ts`, `src/order/order.module.ts`
- Trigger: Runtime resolution currently succeeds through Nest's fallback instantiation; a future Nest upgrade or stricter DI mode could break GET/PATCH/DELETE detail routes.
- Workaround: Register `OrderDetailPipe` in `OrderModule` providers.

## Security Considerations

**No authentication or authorization:**

- Risk: Every endpoint is publicly accessible; there is no auth guard, role check, or tenant isolation.
- Files: `src/main.ts`, `src/app.module.ts`, all `*.controller.ts`
- Current mitigation: None.
- Recommendations: Add an authentication strategy and guards before exposing the API beyond local development.

**Database TLS disabled:**

- Risk: Credentials and query data can be intercepted.
- Files: `src/config/typeorm.ts`, `data-source.ts`, `k8s/data-source-configmap.yaml`
- Current mitigation: Local/trusted-network deployments only.
- Recommendations: Enable encryption and certificate validation in production.

**Potential primary-key overwrite via customer update:**

- Risk: Clients may submit `id` in an update payload.
- Files: `src/customer/dto/update-customer.dto.ts`, `src/customer/services/customer.service.ts`
- Current mitigation: None beyond DTO validation.
- Recommendations: Remove or ignore `id` in update flows.

**DI fallback masks missing providers:**

- Risk: `useContainer(..., { fallbackOnErrors: true })` can instantiate classes without their dependencies.
- Files: `src/main.ts`, `test/e2e/extend-test.ts`
- Current mitigation: Unit/E2E tests currently pass.
- Recommendations: Disable fallback in production and register all pipes/providers explicitly.

**Secret handling in Kubernetes example:**

- Risk: `k8s/database-secret.example.yaml` leaves password fields blank and `.gitignore` ignores `*secret.yaml`, so a real secret file can be created locally and accidentally committed under another name.
- Files: `k8s/database-secret.example.yaml`, `k8s/.gitignore`
- Current mitigation: Example-only file.
- Recommendations: Document secret creation and validate manifests in CI.

## Performance Bottlenecks

**Order queries eagerly load relations:**

- Problem: `OrderService.findAll` and `OrderDetailService.findAll` enable `relations: { joinAndSelect: true }`.
- Files: `src/order/services/order.service.ts`, `src/order/services/order-detail.service.ts`
- Cause: Large joins and N+1-like expansion for list endpoints.
- Improvement path: Select only requested relations and add query-level limits/field selection.

**High default page size:**

- Problem: `PaginationInterceptor` defaults to 100 items when no pagination is supplied.
- Files: `src/shared/interceptors/pagination.interceptor.ts`
- Cause: `request.query.pagination?.limit ?? 100`.
- Improvement path: Lower the default to 10 or 20 and keep 100 as max.

**No caching layer:**

- Problem: Every read hits MSSQL directly.
- Files: all `*.service.ts`
- Cause: No cache interceptor or external cache configured.
- Improvement path: Add caching for stable reference data such as categories, shippers, and suppliers.

**Verbose CLI logging:**

- Problem: `logging: true` is enabled in the TypeORM data source.
- Files: `data-source.ts`
- Cause: CLI commands emit full SQL.
- Improvement path: Make logging configurable via environment.

## Fragile Areas

**EntityNotFoundFilter:**

- Files: `src/shared/filters/entity-not-found.filter.ts`
- Why fragile: Assumes all route params identify the missing entity and parses them with regex replacements.
- Safe modification: Add targeted tests for each composite route before changing message logic.
- Test coverage: `src/shared/filters/entity-not-found.filter.spec.ts` covers three cases but not all route shapes.

**PaginationInterceptor:**

- Files: `src/shared/interceptors/pagination.interceptor.ts`
- Why fragile: Mutates the incoming request and depends on `@ts-expect-error`.
- Safe modification: Refactor behind a typed interface and keep the existing interceptor spec green.
- Test coverage: `src/shared/interceptors/pagination.interceptor.spec.ts`.

**OrderPipe:**

- Files: `src/order/pipes/order.pipe.ts`
- Why fragile: Deep-clones and mutates nested arrays while converting IDs to relation objects.
- Safe modification: Add tests for partial update bodies and nested detail arrays.
- Test coverage: `src/order/pipes/order.pipe.spec.ts` covers create and GET paths.

**Customer validator dual mode:**

- Files: `src/customer/validators/is-existing-customer.validator.ts`
- Why fragile: Behavior depends on the property name and object shape.
- Safe modification: Split into separate validators for existence and uniqueness.
- Test coverage: Covered indirectly through customer E2E/feature tests.

**Reports-to relation:**

- Files: `src/employee/entities/employee.entity.ts`
- Why fragile: One-to-one modeling prevents multiple direct reports.
- Safe modification: Change to many-to-one and update seeds/factories/tests.
- Test coverage: Employee E2E tests do not exercise manager hierarchies.

**Product check constraint:**

- Files: `src/product/entities/product.entity.ts`
- Why fragile: Stray quote makes the decorator inconsistent with migrations.
- Safe modification: Correct the decorator and add a migration if schema changes are needed.
- Test coverage: No direct test.

## Scaling Limits

**Pagination ceiling:**

- Current capacity: 100 items per page maximum.
- Limit: Large exports or bulk reads cannot exceed 100 without code changes.
- Scaling path: Add cursor-based or export-specific pagination.

**SQL Server Express in tests:**

- Current capacity: Express edition storage and resource limits.
- Limit: Test data volume and concurrency are constrained.
- Scaling path: Use Developer/Standard edition images in CI if larger datasets are needed.

**Single API instance:**

- Current capacity: One replica in Kubernetes.
- Limit: No horizontal scaling or failover.
- Scaling path: Increase replicas and add readiness/liveness probes.

## Dependencies at Risk

**TypeORM 1.1.2:**

- Risk: Very new major line with limited long-term validation against NestJS 12.
- Impact: ORM behavior or migration APIs may change.
- Migration plan: Track release notes and pin to a validated version.

**Node 26 and TypeScript 6:**

- Risk: Bleeding-edge runtime/compiler versions.
- Impact: Tooling or dependency incompatibilities.
- Migration plan: Keep `devEngines` constraints and run CI on the declared versions.

**@nestjs/mapped-types wildcard:**

- Risk: Unbounded version resolution.
- Impact: Breaking changes can enter builds unexpectedly.
- Migration plan: Pin to a tested version.

**@rapiq packages 2.4.0:**

- Risk: Niche filtering library; maintenance and compatibility risk.
- Impact: Filtering/pagination behavior could break with upgrades.
- Migration plan: Keep versions pinned and cover filter behavior with E2E tests.

## Missing Critical Features

**Authentication and authorization:**

- Problem: No identity or access control anywhere in the API.
- Blocks: Production use, multi-user scenarios, and auditability.

**Health and readiness endpoints:**

- Problem: Docker health check targets `/`, which only returns "Hello World!".
- Blocks: Reliable orchestration health checks and graceful shutdown handling.

**API documentation:**

- Problem: No Swagger/OpenAPI generation or published schema.
- Blocks: Client generation and external integration.

**Rate limiting and abuse protection:**

- Problem: No throttling or request-size limits configured.
- Blocks: Safe public deployment.

**Observability:**

- Problem: No structured logging, metrics, or tracing.
- Blocks: Production debugging and performance monitoring.

## Test Coverage Gaps

**Application service:**

- What's not tested: `AppService.getHello`.
- Files: `src/app.service.ts`
- Risk: Trivial but currently uncovered.
- Priority: Low

**Order feature tests:**

- What's not tested: Pactum feature scenarios for order and order-detail endpoints.
- Files: `test/features/*.feature` (no order feature present)
- Risk: Order flows are covered only by E2E tests, not feature-style regression tests.
- Priority: Medium

**Shared utilities:**

- What's not tested: `date.utils.ts`, `id.utils.ts`, and `money-transformer.ts` have no direct unit tests.
- Files: `src/shared/utils/date.utils.ts`, `src/shared/utils/id.utils.ts`, `src/shared/utils/money-transformer.ts`
- Risk: Edge cases in rounding and identifier validation can regress unnoticed.
- Priority: Medium

**Docker and Kubernetes assets:**

- What's not tested: Dockerfile, bake file, and Kubernetes manifests.
- Files: `Dockerfile`, `docker-bake.hcl`, `k8s/*`
- Risk: Deployment regressions discovered only at release time.
- Priority: Medium

**Environment-dependent suites:**

- What's not tested: E2E and feature suites cannot run without Docker and a seeded MSSQL instance.
- Files: `test/e2e/*.e2e-spec.ts`, `test/features/*.feature-spec.ts`
- Risk: Contributors may merge changes without running full integration coverage.
- Priority: High

---

_Concerns audit: 2026-10-25_
