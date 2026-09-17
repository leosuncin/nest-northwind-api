import type { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import shipperFixtures from './shipper.json';

const shipperJsonFixtures = JSON.stringify(shipperFixtures, (_key, value) =>
  typeof value === 'boolean' ? (value ? 1 : 0) : (value as unknown),
);

export default class ShipperSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.transaction(async (manager) => {
      await manager.sql`ALTER TABLE shipper NOCHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT shipper ON;

      MERGE INTO shipper AS target
      USING OPENJSON(${shipperJsonFixtures}) WITH (
        id bigint,
        companyName varchar(40),
        phone varchar(24)
      ) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET
          companyName = source.companyName,
          phone = source.phone
      WHEN NOT MATCHED THEN
        INSERT (id, companyName, phone)
        VALUES (source.id, source.companyName, source.phone);

      ALTER TABLE shipper CHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT shipper OFF`;
    });
  }
}
