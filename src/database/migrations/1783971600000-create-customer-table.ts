import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerTable1783971600000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`CREATE TABLE customer (
        id bigint IDENTITY PRIMARY KEY,
        code varchar(5) NOT NULL UNIQUE,
        companyName varchar(40) NOT NULL,
        contactName varchar(30),
        contactTitle varchar(30),
        address varchar(60),
        city varchar(15),
        region varchar(15),
        postalCode varchar(10),
        country varchar(15),
        phone varchar(24),
        fax varchar(24)
    )`;
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`DROP TABLE customer`;
  }
}
