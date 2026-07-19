import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductTable1783971900000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`CREATE TABLE product (
      id bigint IDENTITY NOT NULL PRIMARY KEY,
      name varchar (40) NOT NULL,
      supplierId bigint NOT NULL REFERENCES supplier (id),
      categoryId bigint NOT NULL REFERENCES category (id),
      quantityPerUnit varchar (20) NULL,
      unitPrice money NULL DEFAULT (0) CHECK (unitPrice >= 0),
      unitsInStock int NULL DEFAULT (0) CHECK (unitsInStock >= 0),
      unitsOnOrder int NULL DEFAULT (0) CHECK (unitsOnOrder >= 0),
      reorderLevel smallint NULL DEFAULT (0) CHECK (reorderLevel >= 0),
      discontinued bit NOT NULL DEFAULT (0)
    )`;
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`DROP TABLE product`;
  }
}
