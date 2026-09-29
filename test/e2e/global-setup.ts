import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MSSQLServerContainer } from '@testcontainers/mssqlserver';
import { DataSource, type DataSourceOptions } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';
import type { TestProject } from 'vitest/node';

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

  project.provide('typeOrmOptions', options);
  project.onTestsRerun(async () => {
    await dataSource.dropDatabase();
    await dataSource.runMigrations();
  });

  return async function teardown() {
    await dataSource.destroy();
    await container.stop();
  };
}
