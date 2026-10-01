import { ok } from 'node:assert/strict';
import { glob } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import type {
  DataSourceOptions,
  EntitySubscriberInterface,
  MigrationInterface,
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

export async function* load<M = Function>(
  globPattern: string,
): AsyncGenerator<M, void, unknown> {
  for await (const path of glob(join(process.cwd(), globPattern))) {
    const module = (await import(pathToFileURL(path).href)) as {
      default: M;
      [fixture: string]: M;
    };

    yield 'default' in module ? module.default : Object.values<M>(module)[0];
  }
}

export async function loadFromDataSourceOptions(
  options: DataSourceOptions & SeederOptions,
) {
  const migrations: Migration[] = [];

  assertStringArray(options.migrations);
  for await (const migration of load<Migration>(options.migrations[0])) {
    migrations.push(migration);
  }

  const subscribers: Subscriber[] = [];

  assertStringArray(options.subscribers);
  for await (const subscriber of load<Subscriber>(options.subscribers[0])) {
    subscribers.push(subscriber);
  }

  const seeds: Seed[] = [];

  assertStringArray(options.seeds);
  for await (const seed of load<Seed>(options.seeds[0])) {
    seeds.push(seed);
  }

  const factories: SeederFactoryItem[] = [];

  assertStringArray(options.factories);
  for await (const factory of load<SeederFactoryItem>(options.factories![0])) {
    factories.push(factory);
  }

  return {
    ...options,
    migrations,
    subscribers,
    seeds,
    factories,
  };
}
