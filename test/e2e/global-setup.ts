import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MSSQLServerContainer } from '@testcontainers/mssqlserver';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { runSeeders, type SeederOptions } from 'typeorm-extension';
import type { TestProject } from 'vitest/node';

import { categoryFactory } from '../../src/database/factories/category.factory.js';
import { customerFactory } from '../../src/database/factories/customer.factory.js';
import { employeeFactory } from '../../src/database/factories/employee.factory.js';
import { orderDetailFactory } from '../../src/database/factories/order-detail.factory.js';
import { orderFactory } from '../../src/database/factories/order.factory.js';
import { productFactory } from '../../src/database/factories/product.factory.js';
import { shipperFactory } from '../../src/database/factories/shipper.factory.js';
import { supplierFactory } from '../../src/database/factories/supplier.factory.js';
import CategorySeeder from '../../src/database/seeds/category.seeder.js';
import CustomerSeeder from '../../src/database/seeds/customer.seeder.js';
import EmployeeSeeder from '../../src/database/seeds/employee.seeder.js';
import OrderSeeder from '../../src/database/seeds/order.seeder.js';
import ProductSeeder from '../../src/database/seeds/product.seeder.js';
import ShipperSeeder from '../../src/database/seeds/shipper.seeder.js';
import SupplierSeeder from '../../src/database/seeds/supplier.seeder.js';

declare module 'vitest' {
  export interface ProvidedContext {
    typeOrmOptions: DataSourceOptions & TypeOrmModuleOptions & SeederOptions;
  }
}

export default async function setup(project: TestProject) {
  const container = await new MSSQLServerContainer(
    'mcr.microsoft.com/mssql/server:2022-latest',
  )
    .acceptLicense()
    .withEnvironment({ MSSQL_PID: 'Express' })
    .withHealthCheck({
      test: [
        'CMD-SHELL',
        '/opt/mssql-tools18/bin/sqlcmd -h -1 -t 1 -C -b -U sa -P ${MSSQL_SA_PASSWORD} -Q "SELECT name FROM sys.databases WHERE name = N\'master\'"',
      ],
      interval: 10_000,
      timeout: 5_000,
      retries: 5,
    })
    .start();
  const options = {
    type: 'mssql',
    host: container.getHost(),
    port: container.getMappedPort(1433),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    synchronize: false,
    migrationsRun: false,
    autoLoadEntities: true,
    seedTracking: true,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      appName: `Northwind${container.getName()}`,
    },
    subscribers: ['src/**/*.subscriber.ts'],
    migrations: ['src/database/migrations/*.ts'],
    seeds: ['src/database/seeds/*.seeder.ts'],
    factories: ['src/database/factories/*.factory.ts'],
  } satisfies DataSourceOptions & TypeOrmModuleOptions & SeederOptions;
  const dataSource = new DataSource(options);

  await dataSource.initialize();
  await dataSource.runMigrations();
  await runSeeders(dataSource, {
    seeds: [
      CategorySeeder,
      EmployeeSeeder,
      ShipperSeeder,
      SupplierSeeder,
      CustomerSeeder,
      ProductSeeder,
      OrderSeeder,
    ],
    factories: [
      categoryFactory,
      employeeFactory,
      shipperFactory,
      supplierFactory,
      customerFactory,
      productFactory,
      orderFactory,
      orderDetailFactory,
    ],
  });

  project.provide('typeOrmOptions', options);
  project.onTestsRerun(async () => {
    await dataSource.dropDatabase();
    await dataSource.runMigrations();
    await runSeeders(dataSource, {
      seeds: [
        CategorySeeder,
        EmployeeSeeder,
        ShipperSeeder,
        SupplierSeeder,
        CustomerSeeder,
        ProductSeeder,
        OrderSeeder,
      ],
      factories: [
        categoryFactory,
        employeeFactory,
        shipperFactory,
        supplierFactory,
        customerFactory,
        productFactory,
        orderFactory,
        orderDetailFactory,
      ],
    });
  });

  return async function teardown() {
    await dataSource.destroy();
    await container.stop();
  };
}
