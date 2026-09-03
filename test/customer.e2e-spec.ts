import { HttpStatus, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { createURLCodec } from '@rapiq/codec-url';
import { defineQuery, QueryBuildInput } from '@rapiq/core';
import {
  MSSQLServerContainer,
  type StartedMSSQLServerContainer,
} from '@testcontainers/mssqlserver';
import request from 'supertest';
import type { App } from 'supertest/types';
import { runSeeders, setDataSource, useSeederFactory } from 'typeorm-extension';

import { AppModule } from '../src/app.module.js';
import typeormConfig from '../src/config/typeorm.js';
import { CreateCustomer } from '../src/customer/dto/create-customer.dto.js';
import { Customer } from '../src/customer/entities/customer.entity.js';
import { buildTypeOrmOptions } from './helpers.js';
import { Pagination } from '../src/shared/interceptors/pagination.interceptor.js';

const codec = createURLCodec();

describe('CustomerController (e2e)', () => {
  let app: INestApplication<App>;
  let container: StartedMSSQLServerContainer;

  beforeAll(async () => {
    container = await new MSSQLServerContainer(
      'mcr.microsoft.com/mssql/server:2022-latest',
    )
      .acceptLicense()
      .withEnvironment({ MSSQL_PID: 'Express' })
      .withWaitForMessage(/.*Attribute synchronization manager initialized*/)
      .start();

    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(typeormConfig.KEY)
      .useValue(await buildTypeOrmOptions(container))
      .compile();

    app = module.createNestApplication();

    await app.init();
  }, 60_000);

  beforeEach(async () => {
    const dataSource = app.get(getDataSourceToken());

    setDataSource(dataSource);
    await runSeeders(dataSource);
  });

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  test('given a GET request to /customer when no params are provided then it should return a paginated list', async () => {
    const response = await request(app.getHttpServer())
      .get('/customer')
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('items', expect.arrayContaining([]));
    expect(response.body).toHaveProperty('meta');
    expect(response.body).toHaveProperty('meta.itemsPerPage', 100);
    expect(response.body).toHaveProperty('meta.currentPage', 1);
  });

  test.each([
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
    async (
      filters: QueryBuildInput<Customer>,
      meta: Pagination<Customer>['meta'],
    ) => {
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

  test('given a POST request to /customer when a valid customer is provided then it should create and return the created customer', async () => {
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

  test('given a GET request to /customer/:id when the customer exists then it should return the customer', async () => {
    const customer = await useSeederFactory(Customer).save();

    const response = await request(app.getHttpServer())
      .get(`/customer/${customer.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject(expect.objectContaining(customer));
  });

  test('given a PATCH request to /customer/:id when the customer exists then it should update and return the updated customer', async () => {
    const customer = await useSeederFactory(Customer).save();

    const response = await request(app.getHttpServer())
      .patch(`/customer/${customer.id}`)
      .send({ companyName: 'Updated Company' })
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id', customer.id);
    expect(response.body).toHaveProperty('companyName', 'Updated Company');
  });

  test('given a DELETE request to /customer/:id when the customer exists then it should delete the customer', async () => {
    const customer = await useSeederFactory(Customer).save();

    await request(app.getHttpServer())
      .delete(`/customer/${customer.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/customer/${customer.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
