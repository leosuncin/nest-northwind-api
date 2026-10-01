import type { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import employeeFixtures from './employee.json' with { type: 'json' };

const employeeJsonFixtures = JSON.stringify(employeeFixtures, (_key, value) =>
  typeof value === 'boolean' ? (value ? 1 : 0) : (value as unknown),
);

export default class EmployeeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.transaction(async (manager) => {
      await manager.sql`ALTER TABLE employee NOCHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT employee ON;

      MERGE INTO employee AS target
      USING OPENJSON(${employeeJsonFixtures}) WITH (
        id bigint,
        firstName varchar(10),
        lastName varchar(20),
        title varchar(30),
        titleOfCourtesy varchar(25),
        birthDate date,
        hireDate date,
        address varchar(60),
        city varchar(15),
        region varchar(15),
        postalCode varchar(10),
        country varchar(15),
        homePhone varchar(24),
        extension varchar(4),
        photo varchar(255),
        notes varchar(MAX),
        reportsToId bigint
      ) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET
          firstName = source.firstName,
          lastName = source.lastName,
          title = source.title,
          titleOfCourtesy = source.titleOfCourtesy,
          birthDate = source.birthDate,
          hireDate = source.hireDate,
          address = source.address,
          city = source.city,
          region = source.region,
          postalCode = source.postalCode,
          country = source.country,
          homePhone = source.homePhone,
          extension = source.extension,
          photo = source.photo,
          notes = source.notes,
          reportsTo = source.reportsToId
      WHEN NOT MATCHED THEN
        INSERT (id, firstName, lastName, title, titleOfCourtesy, birthDate, hireDate, address, city, region, postalCode, country, homePhone, extension, photo, notes, reportsTo)
        VALUES (source.id, source.firstName, source.lastName, source.title, source.titleOfCourtesy, source.birthDate, source.hireDate, source.address, source.city, source.region, source.postalCode, source.country, source.homePhone, source.extension, source.photo, source.notes, source.reportsToId);

      ALTER TABLE employee CHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT employee OFF`;
    });
  }
}
