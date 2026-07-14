import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoryTable1783971500000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`CREATE TABLE category (
        id bigint IDENTITY PRIMARY KEY,
        name varchar(15) NOT NULL,
        description varchar(MAX),
        picture varchar(255) NULL
    )`;
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`DROP TABLE category`;
  }
}
