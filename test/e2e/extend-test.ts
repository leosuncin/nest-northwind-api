import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { useContainer } from 'class-validator';
import type { App } from 'supertest/types.js';
import { setDataSource } from 'typeorm-extension';
import { test as baseTest, inject } from 'vitest';

import { AppModule } from '../../src/app.module.js';
import typeormConfig from '../../src/config/typeorm.js';
import { loadFromDataSourceOptions } from './helpers.js';

export const test = baseTest
  // oxlint-disable-next-line no-empty-pattern
  .extend('app', { scope: 'file' }, async ({}, { onCleanup }) => {
    const options = await loadFromDataSourceOptions(inject('typeOrmOptions'));
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
  });
