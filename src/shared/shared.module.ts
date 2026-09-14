import { DynamicModule, Module } from '@nestjs/common';
import { SchemaRegistry, type Schema } from '@rapiq/core';

import { createSchemaRegistryProviders } from './providers/schema-registry.provider.js';

@Module({})
export class SharedModule {
  static forFeature(...schemas: Schema<any>[]): DynamicModule {
    const providers = createSchemaRegistryProviders(...schemas);

    return {
      module: SharedModule,
      providers: providers.concat(SchemaRegistry),
      exports: [SchemaRegistry],
    };
  }
}
