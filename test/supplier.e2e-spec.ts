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
import { CreateSupplier } from '../src/supplier/dto/create-supplier.dto.js';
import { Supplier } from '../src/supplier/entities/supplier.entity.js';
import { buildTypeOrmOptions } from './helpers.js';

describe('SupplierController (e2e)', () => {
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

  test('given a GET request to /supplier when no params are provided then it returns a paginated list', async () => {
    const response = await request(app.getHttpServer())
      .get('/supplier')
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('items', expect.arrayContaining([]));
    expect(response.body).toHaveProperty('meta');
    expect(response.body).toHaveProperty('meta.itemsPerPage', 10);
    expect(response.body).toHaveProperty('meta.currentPage', 1);
  });

  test('given a GET request to /supplier when page is zero then it returns a validation error', async () => {
    await request(app.getHttpServer())
      .get('/supplier?page=0')
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a GET request to /supplier when limit is negative then it returns a validation error', async () => {
    await request(app.getHttpServer())
      .get('/supplier?limit=-1')
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /supplier when a valid supplier is provided then it creates and returns it', async () => {
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

  test('given a POST request to /supplier when companyName is missing then it returns a validation error', async () => {
    await request(app.getHttpServer())
      .post('/supplier')
      .send({ contactName: 'John Doe' })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /supplier when companyName exceeds 40 characters then it returns a validation error', async () => {
    await request(app.getHttpServer())
      .post('/supplier')
      .send({ companyName: 'a'.repeat(41) })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /supplier when homePage exceeds 255 characters then it returns a validation error', async () => {
    await request(app.getHttpServer())
      .post('/supplier')
      .send({ companyName: 'Test Supplier', homePage: 'a'.repeat(256) })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a GET request to /supplier/:id when the supplier exists then it returns the supplier', async () => {
    const supplier = await useSeederFactory(Supplier).save();

    const response = await request(app.getHttpServer())
      .get(`/supplier/${supplier.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject(expect.objectContaining(supplier));
  });

  test('given a PATCH request to /supplier/:id when the supplier exists then it updates and returns it', async () => {
    const supplier = await useSeederFactory(Supplier).save();

    const response = await request(app.getHttpServer())
      .patch(`/supplier/${supplier.id}`)
      .send({ companyName: 'Updated Supplier' })
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id', supplier.id);
    expect(response.body).toHaveProperty('companyName', 'Updated Supplier');
  });

  test('given a PATCH request to /supplier/:id when companyName exceeds 40 characters then it returns a validation error', async () => {
    const supplier = await useSeederFactory(Supplier).save();

    await request(app.getHttpServer())
      .patch(`/supplier/${supplier.id}`)
      .send({ companyName: 'a'.repeat(41) })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a DELETE request to /supplier/:id when the supplier exists then it deletes the supplier', async () => {
    const supplier = await useSeederFactory(Supplier).save();

    await request(app.getHttpServer())
      .delete(`/supplier/${supplier.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/supplier/${supplier.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
