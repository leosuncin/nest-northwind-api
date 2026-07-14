import { type ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { createMocks } from 'node-mocks-http';
import { type BaseEntity, EntityNotFoundError } from 'typeorm';

import { Employee } from '../../employee/entities/employee.entity';
import { EntityNotFoundFilter } from './entity-not-found.filter';

describe('EntityNotFoundFilter', () => {
  test('given a non existing entity when catch then it responds with 404 and a descriptive message', () => {
    const { req, res } = createMocks({
      path: '/employee/1',
      headers: {
        Host: 'localhost',
      },
      params: { id: '1' },
    });
    const filter = new EntityNotFoundFilter<BaseEntity>();
    const host: ArgumentsHost = new ExecutionContextHost([req, res]);
    const exception = new EntityNotFoundError(Employee, { id: 1 });

    filter.catch(exception, host);

    expect(res._getStatusCode()).toBe(HttpStatus.NOT_FOUND);
    expect(res._getJSONData()).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Employee not found',
      why: 'The employee with id: 1 does not exist',
    });
  });
});
