import { HttpStatus } from '@nestjs/common';
import { createURLCodec } from '@rapiq/codec-url';
import {
  defineQuery,
  notContains,
  type QueryBuildInput,
  startsWith,
} from '@rapiq/core';
import request from 'supertest';
import { useSeederFactory } from 'typeorm-extension';

import type { CreateEmployee } from '../../src/employee/dto/create-employee.dto.js';
import type { UpdateEmployee } from '../../src/employee/dto/update-employee.dto.js';
import { Employee } from '../../src/employee/entities/employee.entity.js';
import type { Pagination } from '../../src/shared/interceptors/pagination.interceptor.js';
import { test } from './extend-test.js';

const codec = createURLCodec();

describe('EmployeeController (e2e)', () => {
  test('given a POST request to /employee when a valid employee is provided then it should create and return the created employee', async ({
    app,
  }) => {
    const newEmployee: CreateEmployee = {
      lastName: 'Doe',
      firstName: 'John',
      title: 'Software Engineer',
      titleOfCourtesy: 'Mr.',
      birthDate: new Date('1990-01-01'),
      hireDate: new Date('2020-01-01'),
      address: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'USA',
      region: 'CA',
      homePhone: '(555) 555-5555',
      extension: '123',
      notes: 'A new employee in the software development team.',
    };

    const response = await request(app.getHttpServer())
      .post('/employee')
      .send(newEmployee)
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      id: expect.any(Number) as number,
      lastName: 'Doe',
      firstName: 'John',
      title: 'Software Engineer',
      titleOfCourtesy: 'Mr.',
      birthDate: new Date('1990-01-01').toISOString(),
      hireDate: new Date('2020-01-01').toISOString(),
      address: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'USA',
      region: 'CA',
      homePhone: '(555) 555-5555',
      extension: '123',
      notes: 'A new employee in the software development team.',
      photo: null,
    });
  });

  test('given a GET request to /employee when no parameters are provided then it should use the default pagination values', async ({
    app,
  }) => {
    const response = await request(app.getHttpServer())
      .get('/employee')
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
        fields: ['firstName', 'lastName', 'title'],
        sorts: ['title'],
        filters: notContains<Employee>('title', 'president'),
      } satisfies QueryBuildInput<Employee>,
      {
        itemCount: 9,
        totalItems: 9,
        itemsPerPage: 100,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      } satisfies Pagination<Employee>['meta'],
    ],
    [
      {
        fields: ['firstName', 'lastName', 'title'],
        sorts: ['title'],
        filters: startsWith<Employee>('titleOfCourtesy', 'Ms'),
      } satisfies QueryBuildInput<Employee>,
      {
        itemCount: 4,
        totalItems: 4,
        itemsPerPage: 100,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      } satisfies Pagination<Employee>['meta'],
    ],
  ])(
    'given a GET request to /employee when filters %o then it should return a pagination %o',
    async ([filters, meta], { app }) => {
      const query = defineQuery<Employee>(filters);
      const response = await request(app.getHttpServer())
        .get('/employee')
        .query(codec.encode(query)!)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('items', expect.arrayContaining([]));
      expect(response.body).toHaveProperty('meta', meta);
    },
  );

  test('given a GET request to /employee/:id when the employee exists then it should return the employee', async ({
    app,
  }) => {
    const employee = await useSeederFactory(Employee).save({
      firstName: 'Jane',
      lastName: 'Doe',
    });

    const response = await request(app.getHttpServer())
      .get(`/employee/${employee.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    delete employee.reportsTo;
    expect(response.body).toMatchObject(
      expect.objectContaining({
        ...employee,
        birthDate: employee.birthDate?.toISOString().substring(0, 10),
        hireDate: employee.hireDate?.toISOString().substring(0, 10),
      }),
    );
  });

  test('given a PATCH request to /employee/:id when the employee exists then it should update and return the updated employee', async ({
    app,
  }) => {
    const employee = await useSeederFactory(Employee).save({
      firstName: 'Jane',
      lastName: 'Doe',
    });
    const updatedData: UpdateEmployee = {
      lastName: 'Smith',
      firstName: 'John',
    };

    const response = await request(app.getHttpServer())
      .patch(`/employee/${employee.id}`)
      .send(updatedData)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('id', employee.id);
    expect(response.body).toMatchObject(expect.objectContaining(updatedData));
  });

  test('given a DELETE request to /employee/:id when the employee exists then it should delete the employee', async ({
    app,
  }) => {
    const employee = await useSeederFactory(Employee).save({
      firstName: 'Jane',
      lastName: 'Doe',
    });

    await request(app.getHttpServer())
      .delete(`/employee/${employee.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/employee/${employee.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
