import type { FactoryProvider, InjectionToken, Provider } from '@nestjs/common';
import { SchemaRegistry, type Schema } from '@rapiq/core';

export const schemaRegistryProvider: FactoryProvider = {
  provide: SchemaRegistry,
  useFactory() {
    return new SchemaRegistry();
  },
  durable: true,
};

export function createSchemaRegistryProviders(
  ...schemas: Schema[]
): Provider[] {
  return schemas.map((schema) => ({
    provide: schema.name as InjectionToken<typeof schema>,
    useFactory(registry: SchemaRegistry) {
      registry.add(schema);

      return schema;
    },
    inject: [SchemaRegistry],
  }));
}
