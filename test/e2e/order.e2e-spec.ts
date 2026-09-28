import { HttpStatus } from '@nestjs/common';
import { createURLCodec } from '@rapiq/codec-url';
import { defineQuery, eq, gte, type QueryBuildInput } from '@rapiq/core';
import request from 'supertest';
import { useSeederFactory } from 'typeorm-extension';

import type { CreateOrder } from '../../src/order/dto/create-order.dto.js';
import { OrderDetail } from '../../src/order/entities/order-detail.entity.js';
import { Order } from '../../src/order/entities/order.entity.js';
import type { Pagination } from '../../src/shared/interceptors/pagination.interceptor.js';
import { test } from './extend-test.js';

const codec = createURLCodec();

describe('OrderController (e2e)', () => {
  test('given a GET request to /order when no params are provided then it should return a paginated list', async ({
    app,
  }) => {
    const response = await request(app.getHttpServer())
      .get('/order')
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('items', expect.arrayContaining([]));
    expect(response.body).toHaveProperty('meta');
    expect(response.body).toHaveProperty('meta.itemsPerPage', 100);
    expect(response.body).toHaveProperty('meta.currentPage', 1);
  });

  test.for([
    [
      {
        filters: eq<Order>('shipCountry', 'Germany'),
        pagination: { limit: 10 },
      } satisfies QueryBuildInput<Order>,
      {
        itemCount: 10,
        totalItems: 122,
        itemsPerPage: 10,
        totalPages: 13,
        currentPage: 1,
        hasNextPage: true,
        hasPreviousPage: false,
      } satisfies Pagination<Order>['meta'],
    ],
    [
      {
        filters: gte<Order>('freight', 500),
      } satisfies QueryBuildInput<Order>,
      {
        itemCount: 13,
        totalItems: 13,
        itemsPerPage: 100,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      } satisfies Pagination<Order>['meta'],
    ],
  ])(
    'given a GET request to /order when filters %j then it should return a pagination %o',
    async ([filters, meta], { app }) => {
      const query = defineQuery(filters);
      const response = await request(app.getHttpServer())
        .get('/order')
        .query(codec.encode(query)!)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('items', expect.arrayContaining([]));
      expect(response.body).toHaveProperty('meta', meta);
    },
  );

  test('given a POST request to /order when a valid order is provided then it should create and return the created order', async ({
    app,
  }) => {
    const newOrder = {
      customer: 1,
      employee: 1,
      orderDate: '1996-07-04T00:00:00.000Z',
      requiredDate: '1996-08-01T00:00:00.000Z',
      shippedDate: '1996-07-16T00:00:00.000Z',
      shipVia: 1,
      freight: 32.38,
      shipName: 'Test Ship',
      shipAddress: '123 Test St',
      shipCity: 'TestCity',
      shipRegion: 'TS',
      shipPostalCode: '12345',
      shipCountry: 'Testland',
      details: [
        {
          product: 1,
          unitPrice: 18,
          quantity: 10,
          discount: 0,
        },
      ],
    } as unknown as CreateOrder;

    const response = await request(app.getHttpServer())
      .post('/order')
      .send(newOrder)
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      freight: 32.38,
      shipName: 'Test Ship',
    });
  });

  test('given a POST request to /order when customer is missing then it should return a bad request', async ({
    app,
  }) => {
    await request(app.getHttpServer())
      .post('/order')
      .send({ employee: 1 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /order when employee is missing then it should return a bad request', async ({
    app,
  }) => {
    await request(app.getHttpServer())
      .post('/order')
      .send({ customer: 1 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /order when freight is negative then it should return a bad request', async ({
    app,
  }) => {
    await request(app.getHttpServer())
      .post('/order')
      .send({ customer: 1, employee: 1, freight: -1 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a GET request to /order/:id when the order exists then it should return the order', async ({
    app,
  }) => {
    const order = await useSeederFactory(Order).save();

    const response = await request(app.getHttpServer())
      .get(`/order/${order.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: order.id,
      }),
    );
  });

  test('given a PATCH request to /order/:id when the order exists then it should update and return the updated order', async ({
    app,
  }) => {
    const order = await useSeederFactory(Order).save();

    const response = await request(app.getHttpServer())
      .patch(`/order/${order.id}`)
      .send({ freight: 99.99, shipName: 'Updated Ship' })
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id', order.id);
    expect(response.body).toHaveProperty('freight', 99.99);
    expect(response.body).toHaveProperty('shipName', 'Updated Ship');
  });

  test('given a DELETE request to /order/:id when the order exists then it should delete the order', async ({
    app,
  }) => {
    const order = await useSeederFactory(Order).save();

    await request(app.getHttpServer())
      .delete(`/order/${order.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/order/${order.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  test('given a GET request to /order/:orderId/detail when no params are provided then it should return a paginated list', async ({
    app,
  }) => {
    const orderId = 10248;

    const response = await request(app.getHttpServer())
      .get(`/order/${orderId}/detail`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('items', expect.arrayContaining([]));
    expect(response.body).toHaveProperty('meta');
    expect(response.body).toHaveProperty('meta.totalItems', 3);
    expect(response.body).toHaveProperty('meta.itemsPerPage', 100);
    expect(response.body).toHaveProperty('meta.currentPage', 1);
  });

  test('given a GET request to /order/:orderId/detail when a filter is provided then it should return a paginated result', async ({
    app,
  }) => {
    const orderId = '10248';
    const query = defineQuery({
      filters: eq<OrderDetail>('quantity', 10),
    });

    const response = await request(app.getHttpServer())
      .get(`/order/${orderId}/detail`)
      .query(codec.encode(query)!)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('items', expect.arrayContaining([]));
    expect(response.body).toHaveProperty('meta');
    expect(response.body).toHaveProperty('meta.totalItems', 1);
    expect(response.body.items[0]).toMatchObject({
      orderId,
      productId: '42',
      quantity: 10,
    });
  });

  test('given a POST request to /order/:orderId/detail when a valid detail is provided then it should create it', async ({
    app,
  }) => {
    const order = await useSeederFactory(Order).save();

    const newDetail = {
      product: 1,
      unitPrice: 18,
      quantity: 5,
      discount: 0,
    };

    const response = await request(app.getHttpServer())
      .post(`/order/${order.id}/detail`)
      .send(newDetail)
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('orderId', order.id);
    expect(response.body).toHaveProperty('productId', 1);
  });

  test('given a PATCH request to /order/:orderId/detail/:productId when the detail exists then it should update it', async ({
    app,
  }) => {
    const order = await useSeederFactory(Order).save();
    const productId = 2;

    const detail = await useSeederFactory(OrderDetail).save({
      orderId: order.id,
      productId,
    });

    const response = await request(app.getHttpServer())
      .patch(`/order/${order.id}/detail/${detail.productId}`)
      .send({ quantity: 20, discount: 0.1 })
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('quantity', 20);
    expect(response.body).toHaveProperty('discount', 0.1);
  });

  test('given a DELETE request to /order/:orderId/detail/:productId when the detail exists then it should delete it', async ({
    app,
  }) => {
    const order = await useSeederFactory(Order).save();
    const productId = 2;

    await useSeederFactory(OrderDetail).save({
      orderId: order.id,
      productId,
    });

    await request(app.getHttpServer())
      .delete(`/order/${order.id}/detail/${productId}`)
      .expect(HttpStatus.OK);
  });

  test('given a POST request to /order/:orderId/detail when quantity is less than 1 then it should return a bad request', async ({
    app,
  }) => {
    const order = await useSeederFactory(Order).save();

    await request(app.getHttpServer())
      .post(`/order/${order.id}/detail`)
      .send({ product: 1, unitPrice: 10, quantity: 0, discount: 0 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /order/:orderId/detail when discount is out of range then it should return a bad request', async ({
    app,
  }) => {
    const order = await useSeederFactory(Order).save();

    await request(app.getHttpServer())
      .post(`/order/${order.id}/detail`)
      .send({ product: 1, unitPrice: 10, quantity: 1, discount: 1.5 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /order/:orderId/detail when product does not exist then it should return a bad request', async ({
    app,
  }) => {
    const order = await useSeederFactory(Order).save();

    await request(app.getHttpServer())
      .post(`/order/${order.id}/detail`)
      .send({ product: 99999, unitPrice: 10, quantity: 1, discount: 0 })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
