import type { CallHandler } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { createMocks } from 'node-mocks-http';
import { lastValueFrom, of } from 'rxjs';

import { SetIdInterceptor } from './set-id.interceptor.js';

describe('SetIdInterceptor', () => {
  test('given a request with body when the route param is an id then it should set that id into the body', async () => {
    const { req, res } = createMocks({
      body: {
        code: 'ACME',
      },
      params: { id: '1' },
      path: '/customer/1',
    });
    const context = new ExecutionContextHost([req, res]);
    const next: CallHandler = {
      handle: () => of({}),
    };
    const interceptor = new SetIdInterceptor();

    await lastValueFrom(interceptor.intercept(context, next));

    expect(req.body).toHaveProperty('code', 'ACME');
    expect(req.body).toHaveProperty('id', '1');
  });
});
