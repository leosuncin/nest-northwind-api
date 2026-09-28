import { HttpStatus } from '@nestjs/common';
import { createURLCodec } from '@rapiq/codec-url';
import { defineQuery, notContains, type QueryBuildInput } from '@rapiq/core';
import request from 'supertest';
import { useSeederFactory } from 'typeorm-extension';

import type { CreateCategory } from '../../src/category/dto/create-category.dto.js';
import type { UpdateCategory } from '../../src/category/dto/update-category.dto.js';
import { Category } from '../../src/category/entities/category.entity.js';
import type { Pagination } from '../../src/shared/interceptors/pagination.interceptor.js';
import { test } from './extend-test.js';

const codec = createURLCodec();

describe('CategoryController (e2e)', () => {
  test('given a POST request to /category when a valid category is provided then it should create and return the created category', async ({
    app,
  }) => {
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

  test('given a GET request to /category when no parameters are provided then it should use the default pagination values', async ({
    app,
  }) => {
    const response = await request(app.getHttpServer())
      .get('/category')
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
        fields: ['name', 'description'],
        sorts: '-id',
        filters: { description: { $contains: 'and' } },
        pagination: { limit: 3 },
      } satisfies QueryBuildInput<Category>,
      {
        itemCount: 3,
        totalItems: 6,
        itemsPerPage: 3,
        totalPages: 2,
        currentPage: 1,
        hasNextPage: true,
        hasPreviousPage: false,
      } satisfies Pagination<Category>['meta'],
    ],
    [
      {
        fields: ['name', 'description'],
        sorts: '-id',
        filters: notContains('description', 'or'),
        pagination: { limit: 3, offset: 3 },
      } satisfies QueryBuildInput<Category>,
      {
        itemCount: 3,
        totalItems: 7,
        itemsPerPage: 3,
        totalPages: 3,
        currentPage: 2,
        hasNextPage: true,
        hasPreviousPage: true,
      } satisfies Pagination<Category>['meta'],
    ],
  ])(
    'given a GET request to /category when filters %j then it should return a pagination %o',
    async ([filters, meta], { app }) => {
      const query = defineQuery<Category>(filters);
      const response = await request(app.getHttpServer())
        .get('/category')
        .query(codec.encode(query)!)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty(
        'items',
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            description: expect.any(String),
          }),
        ]),
      );
      expect(response.body).toHaveProperty('meta', meta);
    },
  );

  test('given a GET request to /category/:id when the category exists then it should return the category', async ({
    app,
  }) => {
    const category = await useSeederFactory(Category).save({
      name: 'Junk food',
    });

    const response = await request(app.getHttpServer())
      .get(`/category/${category.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject(expect.objectContaining(category));
  });

  test('given a PATCH request to /category/:id when the category exists then it should update and return the updated category', async ({
    app,
  }) => {
    const category = await useSeederFactory(Category).save({
      name: 'Junk food',
    });
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

  test('given a DELETE request to /category/:id when the category exists then it should delete the category', async ({
    app,
  }) => {
    const category = await useSeederFactory(Category).save({
      name: 'Junk food',
    });

    await request(app.getHttpServer())
      .delete(`/category/${category.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/category/${category.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
