import { HttpStatus, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import {
  MSSQLServerContainer,
  type StartedMSSQLServerContainer,
} from '@testcontainers/mssqlserver';
import request from 'supertest';
import type { App } from 'supertest/types';
import { setDataSource } from 'typeorm-extension';

import { AppModule } from '../src/app.module';
import typeormConfig from '../src/config/typeorm';
import { CreateCustomer } from '../src/customer/dto/create-customer.dto';
import CustomerSeeder from '../src/database/seeds/customer.seeder';

interface CustomerBody {
  id: number;
  code: string;
  companyName: string;
  contactName?: string;
  contactTitle?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  fax?: string;
}

interface PaginatedBody {
  items: CustomerBody[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

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
      .useValue({
        type: 'mssql',
        host: container.getHost(),
        port: container.getMappedPort(1433),
        username: container.getUsername(),
        password: container.getPassword(),
        database: container.getDatabase(),
        synchronize: false,
        migrationsRun: true,
        autoLoadEntities: true,
        options: {
          encrypt: false,
          trustServerCertificate: true,
          appName: 'Northwind Test',
        },
        entities: ['src/**/*.entity.ts'],
        subscribers: ['src/**/*.subscriber.ts'],
        migrations: ['src/database/migrations/*.ts'],
      })
      .compile();

    app = module.createNestApplication();

    await app.init();
  }, 60_000);

  beforeEach(async () => {
    const dataSource = app.get(getDataSourceToken());

    setDataSource(dataSource);
    await new CustomerSeeder().run(dataSource);
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

    const body = response.body as PaginatedBody;

    expect(body.items.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('meta');
    expect(body.meta.itemsPerPage).toBe(10);
    expect(body.meta.currentPage).toBe(1);
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

    const created = response.body as CustomerBody;

    expect(created).toHaveProperty('id');
    expect(created).toMatchObject(expect.objectContaining(newCustomer));

    await request(app.getHttpServer())
      .delete(`/customer/${created.id}`)
      .expect(HttpStatus.OK);
  });

  test('given a GET request to /customer/:id when the customer exists then it should return the customer', async () => {
    const newCustomer: CreateCustomer = {
      code: 'TEST2',
      companyName: 'Test Company',
    };
    const created = await request(app.getHttpServer())
      .post('/customer')
      .send(newCustomer)
      .expect(HttpStatus.CREATED);

    const createdBody = created.body as CustomerBody;

    const response = await request(app.getHttpServer())
      .get(`/customer/${createdBody.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject(expect.objectContaining(newCustomer));

    await request(app.getHttpServer())
      .delete(`/customer/${createdBody.id}`)
      .expect(HttpStatus.OK);
  });

  test('given a PATCH request to /customer/:id when the customer exists then it should update and return the updated customer', async () => {
    const newCustomer: CreateCustomer = {
      code: 'TEST3',
      companyName: 'Test Company',
    };
    const created = await request(app.getHttpServer())
      .post('/customer')
      .send(newCustomer)
      .expect(HttpStatus.CREATED);

    const createdBody = created.body as CustomerBody;

    const response = await request(app.getHttpServer())
      .patch(`/customer/${createdBody.id}`)
      .send({ companyName: 'Updated Company' })
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    const updated = response.body as CustomerBody;

    expect(updated.id).toBe(createdBody.id);
    expect(updated.companyName).toBe('Updated Company');

    await request(app.getHttpServer())
      .delete(`/customer/${createdBody.id}`)
      .expect(HttpStatus.OK);
  });

  test('given a DELETE request to /customer/:id when the customer exists then it should delete the customer', async () => {
    const newCustomer: CreateCustomer = {
      code: 'TEST4',
      companyName: 'Test Company',
    };
    const created = await request(app.getHttpServer())
      .post('/customer')
      .send(newCustomer)
      .expect(HttpStatus.CREATED);

    const createdBody = created.body as CustomerBody;

    await request(app.getHttpServer())
      .delete(`/customer/${createdBody.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/customer/${createdBody.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
