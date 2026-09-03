import { DynamicModule, Module } from '@nestjs/common';
import type { Schema } from '@rapiq/core';

import {
  createSchemaRegistryProviders,
  schemaRegistryProvider,
} from './providers/schema-registry.provider.js';

@Module({})
export class SharedModule {
  static forFeature(...schemas: Schema<any>[]): DynamicModule {
    const providers = createSchemaRegistryProviders(...schemas);

    return {
      module: SharedModule,
      providers: providers.concat(schemaRegistryProvider),
      exports: [schemaRegistryProvider],
    };
  }
}
