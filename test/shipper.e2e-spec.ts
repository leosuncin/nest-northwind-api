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
import type { CreateShipper } from '../src/shipper/dto/create-shipper.dto.js';
import { Shipper } from '../src/shipper/entities/shipper.entity.js';
import { buildTypeOrmOptions } from './helpers.js';

describe('ShipperController (e2e)', () => {
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

  test('given a GET request to /shipper when no query params are provided then it should return a paginated list', async () => {
    const response = await request(app.getHttpServer())
      .get('/shipper')
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('items', expect.arrayContaining([]));
    expect(response.body).toHaveProperty('meta');
    expect(response.body).toHaveProperty('meta.itemCount', 3);
    expect(response.body).toHaveProperty('meta.totalItems', 3);
    expect(response.body).toHaveProperty('meta.itemsPerPage', 100);
    expect(response.body).toHaveProperty('meta.totalPages', 1);
    expect(response.body).toHaveProperty('meta.currentPage', 1);
    expect(response.body).toHaveProperty('meta.hasNextPage', false);
    expect(response.body).toHaveProperty('meta.hasPreviousPage', false);
  });

  test('given a POST request to /shipper when a valid shipper is provided then it should create and return the created shipper', async () => {
    const newShipper: CreateShipper = {
      companyName: 'Test Shipper',
      phone: '(503) 555-9831',
    };

    const response = await request(app.getHttpServer())
      .post('/shipper')
      .send(newShipper)
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject(expect.objectContaining(newShipper));
  });

  test('given a GET request to /shipper/:id when the shipper exists then it should return the shipper', async () => {
    const shipper = await useSeederFactory(Shipper).save();

    const response = await request(app.getHttpServer())
      .get(`/shipper/${shipper.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject(expect.objectContaining(shipper));
  });

  test('given a PATCH request to /shipper/:id when the shipper exists then it should update and return the updated shipper', async () => {
    const shipper = await useSeederFactory(Shipper).save();

    const response = await request(app.getHttpServer())
      .patch(`/shipper/${shipper.id}`)
      .send({ companyName: 'Updated Shipper' })
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id', shipper.id);
    expect(response.body).toHaveProperty('companyName', 'Updated Shipper');
  });

  test('given a DELETE request to /shipper/:id when the shipper exists then it should delete the shipper', async () => {
    const shipper = await useSeederFactory(Shipper).save();

    await request(app.getHttpServer())
      .delete(`/shipper/${shipper.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/shipper/${shipper.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
