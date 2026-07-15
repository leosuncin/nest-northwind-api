import { HttpStatus, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import {
  MSSQLServerContainer,
  type StartedMSSQLServerContainer,
} from '@testcontainers/mssqlserver';
import request from 'supertest';
import type { App } from 'supertest/types';
import { runSeeders, setDataSource } from 'typeorm-extension';

import { AppModule } from '../src/app.module';
import typeormConfig from '../src/config/typeorm';
import { CreateCategory } from '../src/category/dto/create-category.dto';
import { UpdateCategory } from '../src/category/dto/update-category.dto';
import { CategoryService } from '../src/category/services/category.service';

describe('CategoryController (e2e)', () => {
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
        host: 'localhost',
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
        seeds: ['src/database/seeds/*.seeder.ts'],
        factories: ['src/database/factories/*.factory.ts'],
      })
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

  test('given a POST request to /category when a valid category is provided then it should create and return the created category', async () => {
    const newCategory: CreateCategory = {
      name: 'Sport drinks',
      description: 'A new category for sport drinks.',
    };

    const response = await request(app.getHttpServer())
      .post('/category')
      .send(newCategory)
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      id: expect.any(String) as string,
      name: 'Sport drinks',
      description: 'A new category for sport drinks.',
      picture: null,
    });
  });

  test('given a GET request to /category when no limit or page parameters are provided then it should use the default pagination values', async () => {
    const response = await request(app.getHttpServer())
      .get('/category')
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('items', expect.arrayContaining([]));
    expect(response.body).toHaveProperty('meta');
    expect(response.body).toHaveProperty('meta.itemsPerPage', 10);
    expect(response.body).toHaveProperty('meta.currentPage', 1);
  });

  test('given a GET request to /category/:id when the category exists then it should return the category', async () => {
    const category = await app
      .get(CategoryService)
      .create({ name: 'Junk food' });

    const response = await request(app.getHttpServer())
      .get(`/category/${category.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject(expect.objectContaining(category));
  });

  test('given a PATCH request to /category/:id when the category exists then it should update and return the updated category', async () => {
    const category = await app
      .get(CategoryService)
      .create({ name: 'Junk food' });
    const updatedData: UpdateCategory = {
      name: 'Healthy food',
    };

    const response = await request(app.getHttpServer())
      .patch(`/category/${category.id}`)
      .send(updatedData)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id', category.id);
    expect(response.body).toMatchObject(expect.objectContaining(updatedData));
  });

  test('given a DELETE request to /category/:id when the category exists then it should delete the category', async () => {
    const category = await app
      .get(CategoryService)
      .create({ name: 'Junk food' });

    await request(app.getHttpServer())
      .delete(`/category/${category.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/category/${category.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
