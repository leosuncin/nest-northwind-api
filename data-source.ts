import { ok } from 'node:assert/strict';

import { DataSource, type DataSourceOptions } from 'typeorm';
import type {
  SeederConstructor,
  SeederFactoryItem,
  SeederOptions,
} from 'typeorm-extension';

import { load } from './test/e2e/helpers.js';

const username = process.env.MSSQL_USER ?? 'instnwnd';
ok(
  username === 'sa'
    ? process.env.MSSQL_SA_PASSWORD
    : process.env.MSSQL_PASSWORD,
  'MSSQL_PASSWORD environment variable is not set',
);
const password =
  username === 'sa'
    ? process.env.MSSQL_SA_PASSWORD
    : process.env.MSSQL_PASSWORD;

const options: DataSourceOptions & SeederOptions = {
  type: 'mssql',
  host: process.env.MSSQL_HOST ?? 'localhost',
  port: Number.parseInt(process.env.MSSQL_PORT as string, 10) || 1433,
  username,
  password,
  database: process.env.MSSQL_DB ?? 'northwind',
  synchronize: false,
  entities: await Array.fromAsync(load('src/**/*.entity.ts')),
  subscribers: await Array.fromAsync(load('src/**/*.subscriber.ts')),
  migrations: await Array.fromAsync(load('src/database/migrations/*.ts')),
  seeds: await Array.fromAsync(
    load<SeederConstructor>('src/database/seeds/*.seeder.ts'),
  ),
  factories: await Array.fromAsync(
    load<SeederFactoryItem>('src/database/factories/*.factory.ts'),
  ),
  options: {
    encrypt: false,
    trustServerCertificate: true,
    appName: 'Northwind API',
  },
  logging: true,
};

export default new DataSource(options);
