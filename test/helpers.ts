import { glob } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { StartedMSSQLServerContainer } from '@testcontainers/mssqlserver';
import type { DataSourceOptions, MigrationInterface } from 'typeorm';
import type {
  Seeder,
  SeederFactoryItem,
  SeederOptions,
} from 'typeorm-extension';

type Migration = new () => MigrationInterface;
type Seed = new () => Seeder;

export async function buildTypeOrmOptions(
  container: StartedMSSQLServerContainer,
) {
  const migrations: Migration[] = [];

  for await (const file of glob(
    join(process.cwd(), 'src/database/migrations/*.ts'),
  )) {
    const migration = (await import(pathToFileURL(file).href)) as Record<
      string,
      Migration
    >;

    migrations.push(Object.values(migration)[0]);
  }

  const seeds: Seed[] = [];

  for await (const file of glob(
    join(process.cwd(), 'src/database/seeds/*.seeder.ts'),
  )) {
    const seed = (await import(pathToFileURL(file).href)) as { default: Seed };

    seeds.push(seed.default);
  }

  const factories: SeederFactoryItem[] = [];

  for await (const file of glob(
    join(process.cwd(), 'src/database/factories/*.factory.ts'),
  )) {
    const factory = (await import(pathToFileURL(file).href)) as {
      default: SeederFactoryItem;
    };

    factories.push(Object.values(factory)[0]);
  }

  return {
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
    subscribers: ['src/**/*.subscriber.ts'],
    migrations,
    seeds,
    factories,
  } satisfies DataSourceOptions & TypeOrmModuleOptions & SeederOptions;
}
