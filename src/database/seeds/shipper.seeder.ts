import { Seeder } from 'typeorm-extension';

import { Shipper } from '../../shipper/entities/shipper.entity.js';
import type { DataSource } from 'typeorm';

export const speedyExpress = Object.assign<Shipper, Partial<Shipper>>(
  new Shipper(),
  {
    id: 1,
    companyName: 'Speedy Express',
    phone: '(503) 555-9831',
  },
);

export const unitedPackage = Object.assign<Shipper, Partial<Shipper>>(
  new Shipper(),
  {
    id: 2,
    companyName: 'United Package',
    phone: '(503) 555-3199',
  },
);

export const federalShipping = Object.assign<Shipper, Partial<Shipper>>(
  new Shipper(),
  {
    id: 3,
    companyName: 'Federal Shipping',
    phone: '(503) 555-9931',
  },
);

const shipperJsonFixtures = JSON.stringify(
  [speedyExpress, unitedPackage, federalShipping],
  (_key, value) => {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value as unknown;
  },
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
