import { HttpStatus, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import {
  MSSQLServerContainer,
  type StartedMSSQLServerContainer,
} from '@testcontainers/mssqlserver';
import { useContainer } from 'class-validator';

import request from 'supertest';
import type { App } from 'supertest/types';
import { runSeeders, setDataSource, useSeederFactory } from 'typeorm-extension';

import { AppModule } from '../src/app.module';
import typeormConfig from '../src/config/typeorm';
import { CreateProduct } from '../src/product/dto/create-product.dto';
import { Product } from '../src/product/entities/product.entity';
import { buildTypeOrmOptions } from './helpers';

describe('ProductController (e2e)', () => {
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

    useContainer(module, { fallbackOnErrors: true });
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

  test('given a GET request to /product when no params are provided then it should return a paginated list', async () => {
    const response = await request(app.getHttpServer())
      .get('/product')
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('items', expect.arrayContaining([]));
    expect(response.body).toHaveProperty('meta');
    expect(response.body).toHaveProperty('meta.itemsPerPage', 10);
    expect(response.body).toHaveProperty('meta.currentPage', 1);
  });

  test('given a GET request to /product when page is zero then it should return a bad request', async () => {
    await request(app.getHttpServer())
      .get('/product')
      .query({ page: 0 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a GET request to /product when limit is negative then it should return a bad request', async () => {
    await request(app.getHttpServer())
      .get('/product')
      .query({ limit: -1 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /product when a valid product is provided then it should create and return the created product', async () => {
    const newProduct = {
      name: 'Test Product',
      supplier: 1,
      category: 1,
      quantityPerUnit: '10 boxes',
      unitPrice: 9.99,
      unitsInStock: 10,
      unitsOnOrder: 0,
      reorderLevel: 5,
      discontinued: false,
    } as unknown as CreateProduct;

    const response = await request(app.getHttpServer())
      .post('/product')
      .send(newProduct)
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      ...newProduct,
      supplier: { id: '1' },
      category: { id: '1' },
    });
  });

  test('given a POST request to /product when name is missing then it should return a bad request', async () => {
    await request(app.getHttpServer())
      .post('/product')
      .send({ unitPrice: 9.99 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /product when name exceeds 40 characters then it should return a bad request', async () => {
    await request(app.getHttpServer())
      .post('/product')
      .send({ name: 'x'.repeat(41) })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /product when unitPrice is negative then it should return a bad request', async () => {
    await request(app.getHttpServer())
      .post('/product')
      .send({ name: 'Test Product', unitPrice: -1 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /product when unitsInStock is negative then it should return a bad request', async () => {
    await request(app.getHttpServer())
      .post('/product')
      .send({ name: 'Test Product', unitsInStock: -1 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a POST request to /product when category is not an integer then it should return a bad request', async () => {
    await request(app.getHttpServer())
      .post('/product')
      .send({ name: 'Test Product', category: 'abc' })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a GET request to /product/:id when the product exists then it should return the product', async () => {
    const product = await useSeederFactory(Product).save();

    const response = await request(app.getHttpServer())
      .get(`/product/${product.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject(
      expect.objectContaining({
        ...product,
        category: {
          ...product.category,
          id: product.category.id.toString(),
          picture: product.category.picture ?? null,
        },
        supplier: {
          ...product.supplier,
          id: product.supplier.id.toString(),
          fax: product.supplier.fax ?? null,
          region: product.supplier.region ?? null,
          homePage: product.supplier.homePage ?? null,
        },
      }),
    );
  });

  test('given a PATCH request to /product/:id when the product exists then it should update and return the updated product', async () => {
    const product = await useSeederFactory(Product).save();

    const response = await request(app.getHttpServer())
      .patch(`/product/${product.id}`)
      .send({ name: 'Updated Product' })
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id', product.id);
    expect(response.body).toHaveProperty('name', 'Updated Product');
  });

  test('given a PATCH request to /product/:id when name exceeds 40 characters then it should return a bad request', async () => {
    const product = await useSeederFactory(Product).save();

    await request(app.getHttpServer())
      .patch(`/product/${product.id}`)
      .send({ name: 'x'.repeat(41) })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('given a DELETE request to /product/:id when the product exists then it should delete the product', async () => {
    const product = await useSeederFactory(Product).save();

    await request(app.getHttpServer())
      .delete(`/product/${product.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/product/${product.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
