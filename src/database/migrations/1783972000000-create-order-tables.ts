import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTables1783972000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`CREATE TABLE "order" (
      id bigint IDENTITY PRIMARY KEY,
      customerId bigint NOT NULL REFERENCES customer(id),
      employeeId bigint NOT NULL REFERENCES employee(id),
      orderDate datetime,
      requiredDate datetime,
      shippedDate datetime,
      shipVia bigint REFERENCES shipper(id),
      freight money DEFAULT 0 CHECK (freight >= 0),
      shipName varchar(40),
      shipAddress varchar(60),
      shipCity varchar(15),
      shipRegion varchar(15),
      shipPostalCode varchar(10),
      shipCountry varchar(15)
    )`;

    await queryRunner.sql`CREATE TABLE order_detail (
      orderId bigint NOT NULL REFERENCES "order"(id),
      productId bigint NOT NULL REFERENCES product(id),
      unitPrice money NOT NULL DEFAULT 0 CHECK (unitPrice >= 0),
      quantity smallint NOT NULL DEFAULT 1 CHECK (quantity > 0),
      discount real NOT NULL DEFAULT 0 CHECK (discount >= 0 AND discount <= 1),
      PRIMARY KEY (orderId, productId)
    )`;
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`DROP TABLE order_detail`;
    await queryRunner.sql`DROP TABLE "order"`;
  }
}
