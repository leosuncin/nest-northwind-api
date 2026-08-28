import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { createMocks } from 'node-mocks-http';
import { firstValueFrom, of } from 'rxjs';

import { PaginationInterceptor } from './pagination.interceptor.js';

function buildContext(query: Record<string, string>) {
  const { req, res } = createMocks({
    path: '/api',
    headers: {
      Host: 'localhost',
    },
    query,
  });

  return new ExecutionContextHost([req, res]);
}

describe('PaginationInterceptor', () => {
  test('given a paginated response when intercept then it wraps items with metadata', async () => {
    const interceptor = new PaginationInterceptor();
    const items = [{ id: 1 }, { id: 2 }];
    const totalItems = 20;

    const result = await firstValueFrom(
      interceptor.intercept(buildContext({ page: '2', limit: '5' }), {
        handle: () => of([items, totalItems]),
      }),
    );

    expect(result).toEqual({
      items,
      meta: {
        itemCount: items.length,
        totalItems,
        itemsPerPage: 5,
        totalPages: Math.ceil(totalItems / 5),
        currentPage: 2,
        hasNextPage: 2 * 5 < totalItems,
        hasPreviousPage: 2 > 1,
      },
    });
  });

  test('given a response without query when intercept then it applies default pagination', async () => {
    const items = [{ id: 1 }];
    const totalItems = 1;
    const interceptor = new PaginationInterceptor();

    const result = await firstValueFrom(
      interceptor.intercept(buildContext({}), {
        handle: () => of([items, totalItems]),
      }),
    );

    expect(result).toMatchObject({
      meta: { currentPage: 1, itemsPerPage: 10, hasPreviousPage: false },
    });
  });
});
