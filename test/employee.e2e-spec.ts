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
import { Employee } from '../src/employee/entities/employee.entity';
import { CreateEmployeeTable1783971451030 } from '../src/database/migrations/1783971451030-create-employee-table';
import EmployeeSeeder from '../src/database/seeds/employee.seeder';
import { employeeFactory } from '../src/database/factories/employee.factory';
import { CreateEmployee } from '../src/employee/dto/create-employee.dto';
import { UpdateEmployee } from '../src/employee/dto/update-employee.dto';
import { EmployeeService } from '../src/employee/services/employee.service';

describe('EmployeeController (e2e)', () => {
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
        retryAttempts: 10,
        retryDelay: 2000,
        autoLoadEntities: true,
        options: {
          encrypt: false,
          trustServerCertificate: true,
          appName: 'Northwind Test',
        },
        entities: [Employee],
        subscribers: [],
        migrations: [CreateEmployeeTable1783971451030],
        seeds: [EmployeeSeeder],
        factories: [employeeFactory],
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

  test('given a POST request to /employee when a valid employee is provided then it should create and return the created employee', async () => {
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

  test('given a GET request to /employee when no limit or page parameters are provided then it should use the default pagination values', async () => {
    const response = await request(app.getHttpServer())
      .get('/employee')
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('items', expect.arrayContaining([]));
    expect(response.body).toHaveProperty('meta');
    expect(response.body).toHaveProperty('meta.itemsPerPage', 10);
    expect(response.body).toHaveProperty('meta.currentPage', 1);
  });

  test('given a GET request to /employee/:id when the employee exists then it should return the employee', async () => {
    const employee = await app
      .get(EmployeeService)
      .create({ firstName: 'Jane', lastName: 'Doe' });

    const response = await request(app.getHttpServer())
      .get(`/employee/${employee.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    delete employee.reportsTo;
    expect(response.body).toMatchObject(expect.objectContaining(employee));
  });

  test('given a PATCH request to /employee/:id when the employee exists then it should update and return the updated employee', async () => {
    const employee = await app
      .get(EmployeeService)
      .create({ firstName: 'Jane', lastName: 'Doe' });
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

  test('given a DELETE request to /employee/:id when the employee exists then it should delete the employee', async () => {
    const employee = await app
      .get(EmployeeService)
      .create({ firstName: 'Jane', lastName: 'Doe' });

    await request(app.getHttpServer())
      .delete(`/employee/${employee.id}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/employee/${employee.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
