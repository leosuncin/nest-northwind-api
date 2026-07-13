import { ok } from 'node:assert/strict';

import { DataSource, type DataSourceOptions } from 'typeorm';

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

const options: DataSourceOptions = {
  type: 'mssql',
  host: process.env.MSSQL_HOST ?? 'localhost',
  port: Number.parseInt(process.env.MSSQL_PORT as string, 10) || 1433,
  username,
  password,
  database: process.env.MSSQL_DB ?? 'northwind',
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  subscribers: ['src/**/*.subscriber.ts'],
  migrations: ['src/migrations/*.ts'],
  options: {
    encrypt: false,
    trustServerCertificate: true,
    appName: 'Northwind API',
  },
};

export default new DataSource(options);
