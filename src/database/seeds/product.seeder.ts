import type { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import productFixtures from './product.json' with { type: 'json' };

const productJsonFixtures = JSON.stringify(productFixtures, (_key, value) =>
  typeof value === 'boolean' ? (value ? 1 : 0) : (value as unknown),
);

export default class ProductSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.transaction(async (manager) => {
      await manager.sql`ALTER TABLE product NOCHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT product ON;

      MERGE INTO product AS target
      USING OPENJSON(${productJsonFixtures}) WITH (
        id bigint,
        name varchar(40),
        supplierId bigint,
        categoryId bigint,
        quantityPerUnit varchar(20),
        unitPrice money,
        unitsInStock int,
        unitsOnOrder int,
        reorderLevel smallint,
        discontinued bit
      ) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET
          name = source.name,
          supplierId = source.supplierId,
          categoryId = source.categoryId,
          quantityPerUnit = source.quantityPerUnit,
          unitPrice = source.unitPrice,
          unitsInStock = source.unitsInStock,
          unitsOnOrder = source.unitsOnOrder,
          reorderLevel = source.reorderLevel,
          discontinued = source.discontinued
      WHEN NOT MATCHED THEN
        INSERT (
          id,
          name,
          supplierId,
          categoryId,
          quantityPerUnit,
          unitPrice,
          unitsInStock,
          unitsOnOrder,
          reorderLevel,
          discontinued
        ) VALUES (
          source.id,
          source.name,
          source.supplierId,
          source.categoryId,
          source.quantityPerUnit,
          source.unitPrice,
          source.unitsInStock,
          source.unitsOnOrder,
          source.reorderLevel,
          source.discontinued
        );

      ALTER TABLE product CHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT product OFF`;
    });
  }
}
