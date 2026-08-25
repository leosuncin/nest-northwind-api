import { type ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { createMocks } from 'node-mocks-http';
import { type BaseEntity, EntityNotFoundError } from 'typeorm';

import { Customer } from '../../customer/entities/customer.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { OrderDetail } from '../../order/entities/order-detail.entity';
import { EntityNotFoundFilter } from './entity-not-found.filter';

describe('EntityNotFoundFilter', () => {
  test('given a non existing entity when catch then it responds with 404 and a descriptive message', () => {
    const { req, res } = createMocks({
      path: '/employee/1',
      headers: {
        Host: 'localhost',
      },
      params: { id: '1' } satisfies Record<string, string>,
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

  test('given a compositive id when the entity is not found then it responds with 404 and a descriptive message', () => {
    const { req, res } = createMocks({
      path: '/order/1/detail/1',
      headers: {
        Host: 'localhost',
      },
      params: { orderId: '1', productId: '1' } satisfies Record<string, string>,
    });
    const filter = new EntityNotFoundFilter<BaseEntity>();
    const host: ArgumentsHost = new ExecutionContextHost([req, res]);
    const exception = new EntityNotFoundError(OrderDetail, {
      orderId: 1,
      productId: 1,
    });

    filter.catch(exception, host);

    expect(res._getStatusCode()).toBe(HttpStatus.NOT_FOUND);
    expect(res._getJSONData()).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'OrderDetail not found',
      why: 'The order detail with orderId: 1 and productId: 1 does not exist',
    });
  });

  test('given multiple ids when the entity is not found then it responds with 404 and a descriptive message', () => {
    const { req, res } = createMocks({
      path: '/customer/1/order/1/detail/1',
      headers: {
        Host: 'localhost',
      },
      params: {
        orderId: '1',
        productId: '1',
        customerId: '1',
      } satisfies Record<string, string>,
    });
    const filter = new EntityNotFoundFilter<BaseEntity>();
    const host: ArgumentsHost = new ExecutionContextHost([req, res]);
    const exception = new EntityNotFoundError(Customer, {
      orderId: 1,
      productId: 1,
      customerId: 1,
    });

    filter.catch(exception, host);

    expect(res._getStatusCode()).toBe(HttpStatus.NOT_FOUND);
    expect(res._getJSONData()).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Customer not found',
      why: 'The customer with orderId: 1, productId: 1 and customerId: 1 does not exist',
    });
  });
});
