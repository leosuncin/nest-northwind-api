import { HttpStatus } from '@nestjs/common';
import { createURLCodec } from '@rapiq/codec-url';
import { contains, defineQuery, type QueryBuildInput } from '@rapiq/core';
import request from 'supertest';
import { useSeederFactory } from 'typeorm-extension';

import type { Pagination } from '../../src/shared/interceptors/pagination.interceptor.js';
import type { CreateSupplier } from '../../src/supplier/dto/create-supplier.dto.js';
import { Supplier } from '../../src/supplier/entities/supplier.entity.js';
import { test } from './extend-test.js';

const codec = createURLCodec();

describe('SupplierController (e2e)', () => {
  test('given a GET request to /supplier when no params are provided then it returns a paginated list', async ({
    app,
  }) => {
    const response = await request(app.getHttpServer())
      .get('/supplier')
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
        fields: ['companyName', 'contactName', 'contactTitle'],
        sorts: ['companyName'],
        filters: {
          region: { $eq: null },
        },
        pagination: { limit: 10, offset: 10 },
      } satisfies QueryBuildInput<Supplier>,
      {
        itemCount: 10,
        totalItems: 20,
        itemsPerPage: 10,
        totalPages: 2,
        currentPage: 2,
        hasNextPage: false,
        hasPreviousPage: true,
      } satisfies Pagination<Supplier>['meta'],
    ],
    [
      {
        fields: ['companyName', 'contactName', 'contactTitle'],
        sorts: ['companyName', 'contactName'],
        filters: contains<Supplier>('contactTitle', 'sales'),
        pagination: { limit: 5, offset: 10 },
      } satisfies QueryBuildInput<Supplier>,
      {
        itemCount: 1,
        totalItems: 11,
        itemsPerPage: 5,
        totalPages: 3,
        currentPage: 3,
        hasNextPage: false,
        hasPreviousPage: true,
      } satisfies Pagination<Supplier>['meta'],
    ],
  ])(
    'given a GET request to /supplier when filters %j then it returns a pagination %o',
    async ([filters, meta], { app }) => {
      const query = defineQuery<Supplier>(filters);
      const response = await request(app.getHttpServer())
        .get('/supplier')
        .query(codec.encode(query)!)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty(
        'items',
        expect.arrayContaining([
          expect.objectContaining({
            companyName: expect.any(String),
            contactName: expect.any(String),
            contactTitle: expect.any(String),
          }),
        ]),
      );
      expect(response.body).toHaveProperty('meta', meta);
    },
  );

  test('given a POST request to /supplier when a valid supplier is provided then it creates and returns it', async ({
    app,
  }) => {
    const newSupplier: CreateSupplier = {
      companyName: 'Test Supplier',
      contactName: 'John Doe',
      country: 'USA',
      homePage: 'https://example.com',
    };

    const response = await request(app.getHttpServer())
      .post('/supplier')
      .send(newSupplier)
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject(expect.objectContaining(newSupplier));
  });

  test('given a POST request to /supplier when companyName is missing then it returns a validation error', async ({
    app,
  }) => {
    await request(app.getHttpServer())
      .post('/supplier')
      .send({ contactName: 'John Doe' })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /supplier when companyName exceeds 40 characters then it returns a validation error', async ({
    app,
  }) => {
    await request(app.getHttpServer())
      .post('/supplier')
      .send({ companyName: 'a'.repeat(41) })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /supplier when homePage exceeds 255 characters then it returns a validation error', async ({
    app,
  }) => {
    await request(app.getHttpServer())
      .post('/supplier')
      .send({ companyName: 'Test Supplier', homePage: 'a'.repeat(256) })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a GET request to /supplier/:id when the supplier exists then it returns the supplier', async ({
    app,
  }) => {
    const supplier = await useSeederFactory(Supplier).save();

    const response = await request(app.getHttpServer())
      .get(`/supplier/${supplier.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject(expect.objectContaining(supplier));
  });

  test('given a PATCH request to /supplier/:id when the supplier exists then it updates and returns it', async ({
    app,
  }) => {
    const supplier = await useSeederFactory(Supplier).save();

    const response = await request(app.getHttpServer())
      .patch(`/supplier/${supplier.id}`)
      .send({ companyName: 'Updated Supplier' })
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id', supplier.id);
    expect(response.body).toHaveProperty('companyName', 'Updated Supplier');
  });

  test('given a PATCH request to /supplier/:id when companyName exceeds 40 characters then it returns a validation error', async ({
    app,
  }) => {
    const supplier = await useSeederFactory(Supplier).save();

    await request(app.getHttpServer())
      .patch(`/supplier/${supplier.id}`)
      .send({ companyName: 'a'.repeat(41) })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a DELETE request to /supplier/:id when the supplier exists then it deletes the supplier', async ({
    app,
  }) => {
    const supplier = await useSeederFactory(Supplier).save();

    await request(app.getHttpServer())
      .delete(`/supplier/${supplier.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/supplier/${supplier.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
