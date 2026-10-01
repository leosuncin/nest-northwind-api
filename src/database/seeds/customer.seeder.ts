import type { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import customerFixtures from './customer.json' with { type: 'json' };

const customerJsonFixtures = JSON.stringify(customerFixtures, (_key, value) =>
  typeof value === 'boolean' ? (value ? 1 : 0) : (value as unknown),
);

export default class CustomerSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.transaction(async (manager) => {
      await manager.sql`ALTER TABLE customer NOCHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT customer ON;

      MERGE INTO customer AS target
      USING OPENJSON(${customerJsonFixtures}) WITH (
        id bigint,
        code varchar(5),
        companyName varchar(40),
        contactName varchar(30),
        contactTitle varchar(30),
        address varchar(60),
        city varchar(15),
        region varchar(15),
        postalCode varchar(10),
        country varchar(15),
        phone varchar(24),
        fax varchar(24)
      ) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET
          code = source.code,
          companyName = source.companyName,
          contactName = source.contactName,
          contactTitle = source.contactTitle,
          address = source.address,
          city = source.city,
          region = source.region,
          postalCode = source.postalCode,
          country = source.country,
          phone = source.phone,
          fax = source.fax
      WHEN NOT MATCHED THEN
        INSERT (id, code, companyName, contactName, contactTitle, address, city, region, postalCode, country, phone, fax)
        VALUES (source.id, source.code, source.companyName, source.contactName, source.contactTitle, source.address, source.city, source.region, source.postalCode, source.country, source.phone, source.fax);

      ALTER TABLE customer CHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT customer OFF`;
    });
  }
}
