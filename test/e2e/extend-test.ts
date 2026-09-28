import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MSSQLServerContainer } from '@testcontainers/mssqlserver';
import { useContainer } from 'class-validator';
import type { App } from 'supertest/types.js';
import type { DataSourceOptions } from 'typeorm';
import {
  runSeeders,
  setDataSource,
  type SeederOptions,
} from 'typeorm-extension';
import { test as baseTest } from 'vitest';

import { AppModule } from '../../src/app.module.js';
import typeormConfig from '../../src/config/typeorm.js';

export const test = baseTest
  // oxlint-disable-next-line no-empty-pattern
  .extend('container', { scope: 'worker' }, async ({}, { onCleanup }) => {
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
      .withReuse()
      .start();

    onCleanup(async () => {
      await container.stop();
    });

    return container;
  })
  .extend('app', { scope: 'file' }, async ({ container }, { onCleanup }) => {
    const options = {
      type: 'mssql',
      host: container.getHost(),
      port: container.getMappedPort(1433),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
      synchronize: false,
      migrationsRun: true,
      autoLoadEntities: true,
      seedTracking: true,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        appName: 'Northwind Test',
      },
      subscribers: ['src/**/*.subscriber.ts'],
      migrations: ['src/database/migrations/*.ts'],
      seeds: ['src/database/seeds/*.seeder.ts'],
      factories: ['src/database/factories/*.factory.ts'],
    } satisfies DataSourceOptions & TypeOrmModuleOptions & SeederOptions;
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(typeormConfig.KEY)
      .useValue(options)
      .compile();

    const app: INestApplication<App> = module.createNestApplication();

    await app.init();

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    setDataSource(app.get(getDataSourceToken()));

    onCleanup(async () => {
      await app.close();
    });

    return app;
  })
  .extend('seeds', { auto: true, injected: false }, async ({ app }) => {
    await runSeeders(app.get(getDataSourceToken()));
  });
