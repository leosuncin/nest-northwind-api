import { HttpStatus, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
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
    expect(response.body).toHaveProperty('meta.itemsPerPage', 10);
    expect(response.body).toHaveProperty('meta.currentPage', 1);
  });

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
