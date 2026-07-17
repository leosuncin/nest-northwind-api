import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSupplierTable1783971800000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`CREATE TABLE supplier (
      id bigint IDENTITY NOT NULL PRIMARY KEY,
      companyName varchar(40) NOT NULL,
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
    )`;
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`DROP TABLE supplier`;
  }
}
