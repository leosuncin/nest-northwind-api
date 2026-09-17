import type { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import supplierFixtures from './supplier.json';

const supplierJsonFixtures = JSON.stringify(supplierFixtures, (_key, value) =>
  typeof value === 'boolean' ? (value ? 1 : 0) : (value as unknown),
);

export default class SupplierSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.transaction(async (manager) => {
      await manager.sql`ALTER TABLE supplier NOCHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT supplier ON;

      MERGE INTO supplier AS target
      USING OPENJSON(${supplierJsonFixtures}) WITH (
        id bigint,
        companyName varchar(40),
        contactName varchar(30),
        contactTitle varchar(30),
        address varchar(60),
        city varchar(15),
        region varchar(15),
        postalCode varchar(10),
        country varchar(15),
        phone varchar(24),
        fax varchar(24),
        homePage varchar(255)
      ) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET
          companyName = source.companyName,
          contactName = source.contactName,
          contactTitle = source.contactTitle,
          address = source.address,
          city = source.city,
          region = source.region,
          postalCode = source.postalCode,
          country = source.country,
          phone = source.phone,
          fax = source.fax,
          homePage = source.homePage
      WHEN NOT MATCHED THEN
        INSERT (id, companyName, contactName, contactTitle, address, city, region, postalCode, country, phone, fax, homePage)
        VALUES (source.id, source.companyName, source.contactName, source.contactTitle, source.address, source.city, source.region, source.postalCode, source.country, source.phone, source.fax, source.homePage);

      ALTER TABLE supplier CHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT supplier OFF`;
    });
  }
}
