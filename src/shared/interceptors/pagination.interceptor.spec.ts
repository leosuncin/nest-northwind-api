import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { defineSchema, SchemaRegistry } from '@rapiq/core';
import { TestBed } from '@suites/unit';
import { createMocks } from 'node-mocks-http';
import { firstValueFrom, of } from 'rxjs';

import { PaginationInterceptor } from './pagination.interceptor.js';

function buildContext(limit = 10, offset = 0): ExecutionContextHost {
  const { req, res } = createMocks({
    path: '/fixture',
    headers: {
      Host: 'localhost',
    },
    query: {
      codec: 'url-expression',
      page: {
        limit,
        offset,
      },
    },
    url: `/fixture?codec=url-expression&page%5Blimit%5D=${limit}&page%5Boffset%5D=${offset}`,
  });

  return new ExecutionContextHost([req, res]);
}

describe('PaginationInterceptor', () => {
  const registry = new SchemaRegistry();
  let interceptor: PaginationInterceptor;

  beforeEach(async () => {
    registry.add(
      defineSchema({
        name: 'fixture',
        fields: {
          allowed: ['id'],
        },
        pagination: {
          maxLimit: 10,
        },
      }),
    );
    const { unit } = await TestBed.solitary(PaginationInterceptor)
      .mock(Reflector)
      .impl(() => ({
        getAllAndOverride() {
          return 'fixture';
        },
      }))
      .mock(SchemaRegistry)
      .final(registry)
      .compile();

    interceptor = unit;
  });

  test('given a paginated response when intercept then it wraps items with metadata', async () => {
    const items = [{ id: 1 }, { id: 2 }];
    const totalItems = 20;

    const result = await firstValueFrom(
      interceptor.intercept(buildContext(5, (2 - 1) * 5), {
        handle: () => of([items, totalItems]),
      }),
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "items": [
          {
            "id": 1,
          },
          {
            "id": 2,
          },
        ],
        "meta": {
          "currentPage": 2,
          "hasNextPage": true,
          "hasPreviousPage": true,
          "itemCount": 2,
          "itemsPerPage": 5,
          "totalItems": 20,
          "totalPages": 4,
        },
      }
    `);
  });

  test('given a response without query when intercept then it applies default pagination', async () => {
    const items = [{ id: 1 }];
    const totalItems = 1;

    const result = await firstValueFrom(
      interceptor.intercept(buildContext(), {
        handle: () => of([items, totalItems]),
      }),
    );

    expect(result).toMatchObject({
      meta: { currentPage: 1, itemsPerPage: 10, hasPreviousPage: false },
    });
  });
});
