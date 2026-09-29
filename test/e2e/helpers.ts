import { ok } from 'node:assert/strict';
import { glob } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import type {
  DataSourceOptions,
  MigrationInterface,
  EntitySubscriberInterface,
} from 'typeorm';
import type {
  Seeder,
  SeederFactoryItem,
  SeederOptions,
} from 'typeorm-extension';

type Migration = new () => MigrationInterface;
type Subscriber = new () => EntitySubscriberInterface;
type Seed = new () => Seeder;

function assertStringArray(array: unknown): asserts array is [string] {
  ok(Array.isArray(array) && typeof array[0] === 'string');
}

export async function loadFromDataSourceOptions(
  options: DataSourceOptions & SeederOptions,
) {
  const migrations: Migration[] = [];

  assertStringArray(options.migrations);
  for await (const file of glob(join(process.cwd(), options.migrations[0]))) {
    const migration = (await import(pathToFileURL(file).href)) as Record<
      string,
      Migration
    >;

    migrations.push(Object.values(migration)[0]);
  }

  const subscribers: Subscriber[] = [];

  assertStringArray(options.subscribers);
  for await (const file of glob(join(process.cwd(), options.subscribers[0]))) {
    const subscriber = (await import(pathToFileURL(file).href)) as Record<
      string,
      Subscriber
    >;

    subscribers.push(Object.values(subscriber)[0]);
  }

  const seeds: Seed[] = [];

  assertStringArray(options.seeds);
  for await (const file of glob(join(process.cwd(), options.seeds[0]))) {
    const seed = (await import(pathToFileURL(file).href)) as {
      default: Seed;
      [fixture: string]: object;
    };

    seeds.push(seed.default);
  }

  const factories: SeederFactoryItem[] = [];

  assertStringArray(options.factories);
  for await (const file of glob(join(process.cwd(), options.factories![0]))) {
    const factory = (await import(pathToFileURL(file).href)) as {
      default: SeederFactoryItem;
    };

    factories.push(Object.values(factory)[0]);
  }

  return {
    ...options,
    migrations,
    subscribers,
    seeds,
    factories,
  };
}
