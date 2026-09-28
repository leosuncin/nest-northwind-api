import { HttpStatus } from '@nestjs/common';
import { createURLCodec } from '@rapiq/codec-url';
import { defineQuery, QueryBuildInput } from '@rapiq/core';
import request from 'supertest';
import { useSeederFactory } from 'typeorm-extension';

import type { CreateCustomer } from '../../src/customer/dto/create-customer.dto.js';
import { Customer } from '../../src/customer/entities/customer.entity.js';
import type { Pagination } from '../../src/shared/interceptors/pagination.interceptor.js';
import { test } from './extend-test.js';

const codec = createURLCodec();

describe('CustomerController (e2e)', () => {
  test('given a GET request to /customer when no params are provided then it should return a paginated list', async ({
    app,
  }) => {
    const response = await request(app.getHttpServer())
      .get('/customer')
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
        fields: ['code', 'companyName', 'contactName', 'contactTitle'],
        sorts: ['code'],
        filters: {
          country: { $eq: 'USA' },
        },
        pagination: { limit: 10 },
      } satisfies QueryBuildInput<Customer>,
      {
        itemCount: 10,
        totalItems: 13,
        itemsPerPage: 10,
        totalPages: 2,
        currentPage: 1,
        hasNextPage: true,
        hasPreviousPage: false,
      } satisfies Pagination<Customer>['meta'],
    ],
    [
      {
        fields: ['code', 'companyName', 'contactName', 'contactTitle'],
        sorts: ['-code'],
        filters: {
          region: { $eq: null },
        },
        pagination: { limit: 20, offset: 20 },
      } satisfies QueryBuildInput<Customer>,
      {
        itemCount: 20,
        totalItems: 60,
        itemsPerPage: 20,
        totalPages: 3,
        currentPage: 2,
        hasNextPage: true,
        hasPreviousPage: true,
      } satisfies Pagination<Customer>['meta'],
    ],
    [
      {
        fields: ['code', 'companyName', 'contactName', 'contactTitle'],
        sorts: ['contactName'],
        filters: {
          contactTitle: { $contains: 'owner' },
        },
      } satisfies QueryBuildInput<Customer>,
      {
        itemCount: 18,
        totalItems: 18,
        itemsPerPage: 100,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      } satisfies Pagination<Customer>['meta'],
    ],
  ])(
    'given a GET request to /customer when filters %o then it should return a pagination %o',
    async ([filters, meta], { app }) => {
      const query = defineQuery<Customer>(filters);
      const response = await request(app.getHttpServer())
        .get('/customer')
        .query(codec.encode(query)!)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty(
        'items',
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            companyName: expect.any(String),
            contactName: expect.any(String),
            contactTitle: expect.any(String),
          }),
        ]),
      );
      expect(response.body).toHaveProperty('meta', meta);
    },
  );

  test('given a POST request to /customer when a valid customer is provided then it should create and return the created customer', async ({
    app,
  }) => {
    const newCustomer: CreateCustomer = {
      code: 'TEST1',
      companyName: 'Test Company',
      contactName: 'John Doe',
      country: 'USA',
    };

    const response = await request(app.getHttpServer())
      .post('/customer')
      .send(newCustomer)
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject(expect.objectContaining(newCustomer));
  });

  test('given a POST request to /customer when a customer with the same code is provided then it should abort the creation', async ({
    app,
  }) => {
    const newCustomer = await useSeederFactory(Customer).make({
      code: 'ANATR',
    });

    const response = await request(app.getHttpServer())
      .post('/customer')
      .send(newCustomer)
      .expect(HttpStatus.BAD_REQUEST)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchInlineSnapshot(`
      {
        "error": "Bad Request",
        "message": [
          "Customer with code equal to ANATR exists",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('given a GET request to /customer/:id when the customer exists then it should return the customer', async ({
    app,
  }) => {
    const customer = await useSeederFactory(Customer).save();

    const response = await request(app.getHttpServer())
      .get(`/customer/${customer.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject(expect.objectContaining(customer));
  });

  test('given a PATCH request to /customer/:id when the customer exists then it should update and return the updated customer', async ({
    app,
  }) => {
    const customer = await useSeederFactory(Customer).save();

    const response = await request(app.getHttpServer())
      .patch(`/customer/${customer.id}`)
      .send({ code: customer.code, companyName: 'Updated Company' })
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id', customer.id);
    expect(response.body).toHaveProperty('companyName', 'Updated Company');
  });

  test('given a PATCH request to /customer/:id when the code of other customer is provided then it should abort the update', async ({
    app,
  }) => {
    const response = await request(app.getHttpServer())
      .patch('/customer/10')
      .send({ code: 'ANATR' })
      .expect(HttpStatus.BAD_REQUEST)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchInlineSnapshot(`
      {
        "error": "Bad Request",
        "message": [
          "Customer with code equal to ANATR exists",
        ],
        "statusCode": 400,
      }
    `);
  });

  test('given a DELETE request to /customer/:id when the customer exists then it should delete the customer', async ({
    app,
  }) => {
    const customer = await useSeederFactory(Customer).save();

    await request(app.getHttpServer())
      .delete(`/customer/${customer.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/customer/${customer.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
