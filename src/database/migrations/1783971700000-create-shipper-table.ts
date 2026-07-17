import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShipperTable1783971700000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`CREATE TABLE shipper (
      id bigint IDENTITY (1, 1) NOT NULL PRIMARY KEY,
      companyName varchar (40) NOT NULL,
      phone varchar (24) NULL
    )`;
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`DROP TABLE shipper`;
  }
}
