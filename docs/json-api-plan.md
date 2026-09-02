# JSON:API 1.1 Implementation Specification

## 1. Purpose

Convert the API to a breaking, JSON:API 1.1-compatible contract while preserving the existing NestJS, TypeORM, class-transformer, and class-validator domain logic.

Implementation follows specification-driven development:

1. Identify the applicable normative JSON:API requirement.
2. Add a failing contract or integration test for that requirement.
3. Implement the smallest change that satisfies the test.
4. Run unit, end-to-end, migration, and Bruno verification as applicable.
5. Mark the requirement complete in the conformance matrix.

The normative reference is <https://jsonapi.org/format/1.1/>. Keywords such as MUST, MUST NOT, SHOULD, and MAY retain their RFC 2119 meanings.

## 2. Architecture Decisions

| Concern                     | Decision                                                                       |
| --------------------------- | ------------------------------------------------------------------------------ |
| Query parsing and execution | `@rapiq/core`, `@rapiq/codec-url`, and `@rapiq/adapter-typeorm` 2.2.0          |
| Document serialization      | `ts-japi` 1.12.4                                                               |
| Existing API                | Hard cutover; no legacy response negotiation                                   |
| Resource names              | Plural types and plural routes                                                 |
| `OrderDetail` identity      | Persisted computed `bigint` primary key derived from `orderId` and `productId` |
| Attribute names             | Existing camelCase names                                                       |
| API media type              | `application/vnd.api+json`                                                     |
| JSON:API version            | 1.1                                                                            |

`json-api-nestjs` is excluded because its published peer dependencies require NestJS 10 and TypeORM 0.3, while this project uses NestJS 12 and TypeORM 1.1.

## 3. Supported Profile

JSON:API distinguishes required protocol behavior from optional capabilities. This implementation will support:

- Resource collection and individual-resource documents
- Create, update, and delete operations
- To-one and to-many relationship linkage in resource documents
- Compound documents through `include`
- Sparse fieldsets through `fields[type]`
- Sorting through `sort`
- Offset pagination through `page[limit]` and `page[offset]`
- Filtering through one documented rapiq filter dialect
- JSON:API error documents
- `self`, pagination, and related-resource links where implemented

The initial release will not support:

- Atomic Operations extension
- Client-generated IDs
- Local IDs (`lid`)
- Dedicated relationship mutation endpoints
- JSON:API extension or profile semantics beyond correct media-type negotiation
- Bulk create, update, or delete

Unsupported optional capabilities must fail predictably where JSON:API requires an error; they must not be advertised through links or documentation.

## 4. Target Resource Model

| Type            | Collection route | Individual route     | Relationships                                |
| --------------- | ---------------- | -------------------- | -------------------------------------------- |
| `categories`    | `/categories`    | `/categories/:id`    | none                                         |
| `customers`     | `/customers`     | `/customers/:id`     | none                                         |
| `employees`     | `/employees`     | `/employees/:id`     | `reportsTo`                                  |
| `shippers`      | `/shippers`      | `/shippers/:id`      | none                                         |
| `suppliers`     | `/suppliers`     | `/suppliers/:id`     | none                                         |
| `products`      | `/products`      | `/products/:id`      | `category`, `supplier`                       |
| `orders`        | `/orders`        | `/orders/:id`        | `customer`, `employee`, `shipVia`, `details` |
| `order-details` | `/order-details` | `/order-details/:id` | `order`, `product`                           |

Related order details may additionally be read from `/orders/:orderId/details`. Dedicated `/relationships/...` routes are out of initial scope and must not be linked until implemented.

All IDs are serialized as strings. MSSQL already returns `bigint` columns as strings; application code must not convert them to JavaScript `number`.

## 5. Conformance Matrix

Each row must have at least one automated contract test before it can be marked complete.

| ID     | JSON:API area      | Requirement                                                                                | Planned test level | Status  |
| ------ | ------------------ | ------------------------------------------------------------------------------------------ | ------------------ | ------- |
| JA-001 | Media type         | Responses use `application/vnd.api+json`                                                   | e2e                | Pending |
| JA-002 | Media type         | Unsupported request media-type parameters produce 415                                      | e2e                | Pending |
| JA-003 | Media type         | Unacceptable JSON:API `Accept` instances produce 406                                       | e2e                | Pending |
| JA-004 | Document           | Top-level document contains `data`, `errors`, or `meta`; `data` and `errors` never coexist | unit/e2e           | Pending |
| JA-005 | Resource object    | Every resource has string `type` and `id`                                                  | unit/e2e           | Pending |
| JA-006 | Resource object    | Attributes exclude relationships and reserved members                                      | unit               | Pending |
| JA-007 | Relationships      | Relationship objects contain valid resource linkage                                        | unit/e2e           | Pending |
| JA-008 | Compound documents | `include` produces deduplicated `included` resources with full linkage                     | e2e                | Pending |
| JA-009 | Sparse fieldsets   | `fields[type]` limits attributes and relationships for that type                           | e2e                | Pending |
| JA-010 | Collection queries | Filtering is allow-listed and parameterized                                                | unit/e2e           | Pending |
| JA-011 | Collection queries | Sorting is allow-listed and deterministic                                                  | unit/e2e           | Pending |
| JA-012 | Pagination         | `page[limit]`/`page[offset]` apply limits and expose navigation links                      | e2e                | Pending |
| JA-013 | Create             | POST accepts a resource document and returns 201, `Location`, and a resource document      | e2e                | Pending |
| JA-014 | Update             | PATCH validates URL/body identity and returns the updated resource                         | e2e                | Pending |
| JA-015 | Delete             | DELETE returns 204 with no document                                                        | e2e                | Pending |
| JA-016 | Errors             | Errors are returned in an `errors` array with string status and useful source data         | unit/e2e           | Pending |
| JA-017 | Not found          | Missing resources produce a JSON:API 404 error                                             | e2e                | Pending |
| JA-018 | Validation         | Invalid attributes/relationships produce 422 errors with JSON Pointers                     | e2e                | Pending |
| JA-019 | Conflicts          | Type or ID conflicts produce 409 errors                                                    | e2e                | Pending |
| JA-020 | Links              | Link URLs preserve applicable query parameters                                             | unit/e2e           | Pending |

## 6. Step 1: Establish the Contract Harness

### Specification

- JSON:API request and response behavior must be testable independently of controller implementation.
- Production and e2e applications must use identical Express configuration.

### Tests first

1. Add shared e2e helpers that send `Accept: application/vnd.api+json` and, for writes, `Content-Type: application/vnd.api+json`.
2. Add reusable assertions for resource documents, collection documents, error documents, resource identifiers, and media types.
3. Add a failing smoke test for `GET /categories` expecting a JSON:API collection document.
4. Add a failing test proving `page[limit]` and `fields[categories]` are parsed as nested query members.

### Implementation

1. Add dependencies for rapiq and ts-japi.
2. Create `src/bootstrap.ts` with `configureApp(app: NestExpressApplication)`.
3. Set Express query parsing to `extended`; Express 5 defaults to `simple`, which cannot parse bracketed JSON:API query parameters.
4. Invoke `configureApp` from `src/main.ts` and every e2e bootstrap.
5. Create `src/json-api/` as the shared protocol boundary.

### Acceptance criteria

- Production and test applications use the same configuration function.
- Bracketed query parameters are parsed into nested objects.
- `pnpm ttsc --noEmit` and `pnpm build` pass with all new dependencies.

## 7. Step 2: Enforce JSON:API Media Types

### Specification

- Servers MUST send JSON:API documents using `application/vnd.api+json`.
- Request media-type parameters other than JSON:API 1.1's `ext` and `profile` parameters are unsupported and produce 415.
- If every JSON:API media type in `Accept` is modified with unsupported parameters, the server responds with 406.
- Supported `ext` or `profile` values must not be claimed unless implemented.

### Tests first

Add table-driven e2e tests for:

- No `Accept` header
- Bare JSON:API `Accept`
- Mixed JSON and JSON:API values
- Unsupported media-type parameter
- Unsupported `ext` and `profile` URI
- Valid JSON:API content type on POST/PATCH
- Non-JSON:API content type on POST/PATCH

### Implementation

1. Add `src/json-api/middleware/media-type.middleware.ts`.
2. Parse media types rather than comparing raw header strings.
3. Return protocol errors through the JSON:API error-document path.
4. Set the response content type centrally.

### Acceptance criteria

- JA-001 through JA-003 pass.
- Every JSON:API document response has the correct content type.
- Unsupported parameters cannot silently alter request semantics.

## 8. Step 3: Define Resource Schemas and Serialization

### Specification

- A resource object MUST contain `type` and `id`.
- `type` and `id` MUST be strings.
- Attributes and relationships must not use the same field name, and neither may use `type` or `id`.
- Relationship members must serialize as relationship objects, not nested attributes.

### Tests first

1. Add serializer unit tests for all eight resource types.
2. For `products`, assert `category` and `supplier` occur only under `relationships`.
3. For `orders`, assert all four relationships are linkage, not attributes.
4. Assert dates and nullable values preserve their current JSON meaning.
5. Assert all bigint IDs remain exact strings.

### Implementation

1. Add `src/json-api/resource.registry.ts` as the single source of truth for:
   - entity class
   - plural resource type
   - canonical route
   - ts-japi serializer
   - relationship name-to-type mapping
   - rapiq schema name
2. Configure ts-japi `Serializer`, `Relator`, and `Linker` instances.
3. Add `JsonApiDocumentInterceptor` to serialize single resources and collections.
4. Replace and delete the existing `PaginationInterceptor` after all collection endpoints migrate.

### Acceptance criteria

- JA-004 through JA-007 pass.
- `{ items, meta }` is no longer emitted.
- Entity relations never leak as ordinary attributes.

## 9. Step 4: Standardize Error Documents

### Specification

- Error responses contain top-level `errors` and no top-level `data`.
- Each error's `status`, when present, is a string.
- Query failures should identify `source.parameter`.
- Body validation failures should identify `source.pointer` using an RFC 6901 JSON Pointer into the request document.

### Tests first

Add unit and e2e cases for:

- Entity not found
- Malformed JSON:API document
- Missing `data`
- Unknown attribute
- Invalid scalar attribute
- Invalid relationship linkage
- Invalid `filter`, `sort`, `page`, `fields`, and `include`
- Unexpected application exception without internal detail leakage

### Implementation

1. Add a global `JsonApiExceptionFilter`.
2. Map `EntityNotFoundError` to 404.
3. Map rapiq parsing errors to 400 with `source.parameter`.
4. Preserve class-validator's structured `ValidationError[]` through a custom `ValidationPipe.exceptionFactory`; do not infer pointers from flattened error strings.
5. Map attribute errors to `/data/attributes/<escaped-name>` and relationship errors to `/data/relationships/<escaped-name>`.
6. Map semantic validation failures to 422 and type/identity conflicts to 409.
7. Remove `EntityNotFoundFilter` after all controllers use the global filter.

### Acceptance criteria

- JA-016 through JA-019 pass.
- No Nest default `{ statusCode, message }` body remains on API routes.
- Internal stack traces, SQL, and entity metadata are absent from production errors.

## 10. Step 5: Implement JSON:API Request Documents

### Specification

- POST and PATCH bodies contain one top-level resource object in `data`.
- POST resource `type` must match the endpoint.
- PATCH resource `type` and `id` must match the endpoint and URL.
- Relationships are supplied as resource identifier objects under `data.relationships`.
- Unknown document and resource members are rejected rather than silently persisted.

### Tests first

Create contract tests using representative resources:

1. Category: attributes only.
2. Product: two to-one relationships.
3. Order: relationships plus nested order detail creation.
4. PATCH with matching and mismatching IDs.
5. Missing, null, malformed, and unknown members.

### Implementation

1. Add `src/json-api/pipes/json-api-body.pipe.ts`.
2. Validate the document shape before domain DTO validation.
3. Convert attributes to the flat shape expected by existing DTOs.
4. Convert relationship linkage such as `{ data: { type: "categories", id: "1" } }` to `category: "1"` for existing relation pipes.
5. Preserve `CreateProduct`, `UpdateOrder`, and DI-backed `IsExisting*` validators.
6. Ensure `ValidationPipe` uses `transform: true`, `whitelist: true`, and `forbidNonWhitelisted: true` at the protocol boundary.

### Acceptance criteria

- Existing domain validators and entity-resolving pipes still enforce business rules.
- Type/ID mismatches return 409.
- Invalid members return JSON:API errors with accurate pointers.

## 11. Step 6: Implement Query Parsing and Allow-Lists

### Specification

- `include`, `fields`, `sort`, `page`, and `filter` are optional JSON:API query-parameter families.
- Once implemented, unsupported values must produce documented errors rather than being silently ignored.
- Sparse fieldset keys are resource types, not relationship names.
- Query values must never be interpolated into SQL.

### Tests first

1. Add parser unit tests for each query family and combinations of them.
2. Add security tests for unknown fields, operators, relations, malformed expressions, and SQL metacharacters.
3. Add an e2e test proving filters, sorting, pagination, includes, and fieldsets compose in one request.
4. Select and freeze one public filter dialect before implementation:
   - expression: `filter=gte(unitPrice,'20')`, or
   - simple: `filter[unitPrice][$gte]=20`.

### Implementation

1. Add one rapiq `defineSchema` per entity with explicit allow-lists for fields, filters, sorts, and relations, plus `pagination.maxLimit` and `schemaMapping`.
2. Register schemas centrally.
3. Add `src/json-api/fields.normalizer.ts` to translate JSON:API type-keyed fieldsets to rapiq's root/relation representation:

   ```text
   JSON:API  fields[products]=name  fields[categories]=name
   rapiq     fields[$root]=name     fields[category]=name
   ```

4. Add a `@JsonApiQuery()` parameter decorator that normalizes and decodes the request using the endpoint schema.
5. Configure parsing to throw on invalid or disallowed input rather than drop it.

### Acceptance criteria

- JA-009 through JA-011 pass.
- Every exposed query field and relationship is allow-listed.
- Invalid query input cannot broaden a query or affect an unapproved column.

## 12. Step 7: Execute Queries Through TypeORM

### Specification

- Query behavior must match the parsed and validated request.
- Pagination must be stable; collection ordering cannot vary unpredictably between pages.
- Filter values must use bound parameters.

### Tests first

1. Rewrite service unit tests to assert QueryBuilder and adapter behavior.
2. Add MSSQL e2e cases for strings, booleans, dates, money values, nulls, and relation filters.
3. Add deterministic-pagination tests where the requested sort has duplicate values.
4. Assert an ID tie-breaker is added to every paginated sort.

### Implementation

Replace each `Repository.findAndCount({ skip, take })` collection query with:

1. `Repository.createQueryBuilder(alias)`.
2. `TypeormAdapter.execute(validatedQuery)`.
3. A deterministic primary-key tie-breaker.
4. `SelectQueryBuilder.getManyAndCount()`.

Migrate one feature module at a time: categories, customers, employees, shippers, suppliers, products, orders, then order details.

### Acceptance criteria

- Filters are parameterized.
- Sorting and pagination are deterministic.
- Counts represent the filtered collection, not only the current page.
- Existing service behavior outside collection queries remains unchanged.

## 13. Step 8: Implement Compound Documents and Sparse Fieldsets

### Specification

- `include` requests cause related resources to appear in top-level `included`.
- Included resources must be connected to primary data through complete relationship linkage.
- A resource may appear only once in the combined `data` and `included` namespace for a given `type`/`id` pair.
- `fields[type]` applies to every resource of that type, including included resources.
- Unsupported include paths produce 400.

### Tests first

1. `GET /products?include=category,supplier`.
2. `GET /orders?include=details.product`.
3. Duplicate related resources are emitted once.
4. Sparse fieldsets apply independently to primary and included types.
5. A fieldset excluding a relationship prevents that relationship member from appearing, even when other fields remain.

### Implementation

1. Connect rapiq-loaded relations to ts-japi `Relator`s.
2. Deduplicate included resources by `type` and string `id`.
3. Preserve full linkage for nested include paths.
4. Apply normalized fieldsets during serialization, not only SQL selection, so output remains authoritative.

### Acceptance criteria

- JA-008 and JA-009 pass for nested and repeated relations.
- No unrelated eager-loaded entity appears in `included`.
- Sparse fieldsets cannot expose an attribute omitted from the allow-list.

## 14. Step 9: Implement Pagination Metadata and Links

### Specification

- Pagination strategy is implementation-defined, but pagination links must preserve all query parameters needed to produce each page.
- Link values must be valid URLs or null where appropriate.

### Tests first

Test first, middle, last, empty, and overrun pages for:

- `self`
- `first`
- `prev`
- `next`
- `last`
- preserved `filter`, `sort`, `include`, and `fields` parameters
- `meta.total`, applied `limit`, and applied `offset`

### Implementation

1. Replace page-number metadata with offset metadata:
   - `total`
   - `limit`
   - `offset`
2. Generate links from the original URL using `URL`/`URLSearchParams` without dropping repeated or bracketed parameters.
3. Use the pagination values actually applied by rapiq, including max-limit clamping if enabled.

### Acceptance criteria

- JA-012 and JA-020 pass.
- Following `next` and `prev` yields the expected adjacent result set.
- Empty collections do not generate invalid offsets or divide by zero.

## 15. Step 10: Add a Single `OrderDetail` ID

### Specification

Every JSON:API resource requires one string `id`. `OrderDetail` currently has a composite `(orderId, productId)` primary key.

### Tests first

1. Unit-test ID encoding and decoding with zero boundaries, maximum 32-bit components, and values whose combined ID exceeds JavaScript's safe integer range.
2. Migration-test up, seed, query, insert, update, delete, and down.
3. E2e-test `/order-details/:id` and `/orders/:orderId/details`.
4. Assert duplicate `(orderId, productId)` pairs remain impossible.

### Implementation

1. Add BigInt-only `encodeOrderDetailId` and `decodeOrderDetailId` helpers that return strings at the HTTP boundary.
2. Add a persisted computed `bigint` column using a collision-free 32-bit packing expression.
3. Discover and drop the server-generated existing composite PK constraint by metadata query.
4. Make computed `id` the primary key.
5. Add a unique constraint on `(orderId, productId)` to preserve existing integrity.
6. Keep both foreign keys unchanged.
7. Map the computed column in the TypeORM entity as non-insertable and non-updatable.
8. Fully reverse the operation in `down()` because CI runs migrate, full revert, and seed.

### SQL Server validation note

Prototype the exact DDL against the project's SQL Server container before committing the migration. SQL Server computed columns do not accept ordinary `NOT NULL` syntax, and primary-key eligibility depends on deterministic/persisted and nullability metadata. Use a deterministic `PERSISTED` expression and, if needed, `ISNULL(...)` so SQL Server recognizes the computed value as non-null.

### Acceptance criteria

- Every order detail has a stable string JSON:API ID.
- Encoding is collision-free for the supported component range.
- No JavaScript `number` arithmetic is used for IDs.
- Existing foreign-key compatibility and pair uniqueness are preserved.
- Migration up and down pass against MSSQL.

## 16. Step 11: Convert Write Endpoints

### Specification

- Successful create returns 201 with the created resource document; a `Location` header should identify it.
- Successful update returns the updated representation with 200, or 204 only when intentionally returning no representation.
- Successful delete returns 204 with no response document.

### Tests first

For every resource type, cover create, update, and delete. Include relationship-heavy product and order cases and computed-ID order details.

### Implementation

1. Change controllers to accept `JsonApiBodyPipe` output.
2. Return serialized resources from POST and PATCH.
3. Set `Location` to the canonical individual-resource URL after POST.
4. Return no body after DELETE.
5. Ensure database constraint errors map to safe 409 or 422 JSON:API errors as appropriate.

### Acceptance criteria

- JA-013 through JA-015 pass for every resource.
- POST/PATCH never return raw entities.
- DELETE emits no JSON body.

## 17. Step 12: Rename Routes and Finalize the Breaking Contract

### Specification

JSON:API does not require plural paths, but route/type consistency is a selected project convention and part of this breaking contract.

### Tests first

1. Change all contract tests to plural routes.
2. Add negative tests proving old singular routes are no longer registered.
3. Verify every resource `links.self` uses its canonical plural route.

### Implementation

1. Rename all eight controller route prefixes.
2. Replace `/order/:orderId/detail` with:
   - `/order-details/:id` as the canonical resource route
   - `/orders/:orderId/details` as the related-resource route
3. Do not emit relationship `self` links until corresponding `/relationships/...` endpoints exist.
4. Remove obsolete positive-int pagination handling and singular-route Bruno requests.

### Acceptance criteria

- Only the documented plural API is exposed.
- All generated links resolve.
- No emitted link advertises an unimplemented endpoint.

## 18. Step 13: Complete Contract, Documentation, and CI

### Tests first

Treat the complete conformance matrix as the release gate.

### Implementation

1. Rewrite all seven e2e suites for JSON:API documents.
2. Rewrite the Bruno collection, including its `{ items, meta }` assertions.
3. Add examples for filtering, sorting, pagination, fieldsets, includes, writes, and errors.
4. Document the chosen filter grammar and all resource allow-lists.
5. Document unsupported optional capabilities.
6. Add a JSON:API conformance checklist to the pull request template or release notes.

### Required verification

```sh
pnpm format
pnpm lint
pnpm ttsc --noEmit
pnpm build
pnpm test
pnpm test:e2e
```

Also run the existing migration cycle and Bruno CI flow against a live MSSQL/API stack.

### Acceptance criteria

- JA-001 through JA-020 are complete.
- Unit, e2e, migration, and Bruno jobs pass.
- Public examples contain only JSON:API media types and document shapes.
- Release is identified as a breaking major change.

## 19. Test Impact Summary

| Surface                      | Required change                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `test/*.e2e-spec.ts`         | Use JSON:API documents, media types, plural routes, query features, and shared bootstrap       |
| `test/e2e/*.yml`             | Replace legacy envelope assertions and singular URLs                                           |
| Service specs                | Replace `findAndCount` mocks with QueryBuilder/adapter behavior                                |
| Controller specs             | Replace scalar page/limit parameters with validated JSON:API query objects                     |
| Pagination interceptor spec  | Delete after replacement                                                                       |
| Entity-not-found filter spec | Replace with global JSON:API error-filter tests                                                |
| New protocol specs           | Media types, serializer, error mapper, body pipe, query normalizer, pagination links, ID codec |

## 20. Risks and Controls

| Risk                                          | Control                                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| Composite ID precision loss                   | BigInt-only arithmetic plus tests above `Number.MAX_SAFE_INTEGER`                       |
| SQL Server computed PK restrictions           | Prototype DDL against Testcontainers before writing the final migration                 |
| rapiq `fields[type]` mismatch                 | One pure normalizer backed by the central resource registry                             |
| ESM-only rapiq packages                       | Build smoke test in Step 1; current project is already ESM                              |
| CJS-only ts-japi package                      | Named import behavior already verified under the current Node runtime                   |
| Query injection                               | Schema allow-lists and TypeORM bound parameters; adversarial e2e tests                  |
| Unstable pagination                           | Always append primary-key sorting as a tie-breaker                                      |
| Test/production parser drift                  | Shared `configureApp` used by both                                                      |
| Serializer leaks relations or internal fields | Per-resource serializer contract tests and explicit allow-lists                         |
| Large breaking change                         | Implement by vertical contract steps; switch routes only after protocol behavior passes |

## 21. Remaining Decisions

Resolve these before Step 6:

1. Choose and document one public rapiq filter dialect:
   - expression: `filter=gte(unitPrice,'20')`
   - simple: `filter[unitPrice][$gte]=20`
2. Choose a default and maximum `page[limit]`.
3. Decide whether to add `@nestjs/swagger`; it is not required for JSON:API compliance and should be a separate scope decision.
