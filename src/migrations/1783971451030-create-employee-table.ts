import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmployeeTable1783971451030 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`CREATE TABLE employee (
        id bigint IDENTITY PRIMARY KEY,
        firstName varchar(10) NOT NULL,
        lastName varchar(20) NOT NULL,
        title varchar(30),
        titleOfCourtesy varchar(25),
        birthDate date CHECK (birthDate IS NULL OR birthDate < GetDate()),
        hireDate date CHECK (hireDate IS NULL OR hireDate <= GetDate()),
        address varchar(60),
        city varchar(15),
        region varchar(15),
        postalCode varchar(10),
        country varchar(15),
        homePhone varchar(24),
        extension varchar(4),
        photo varchar(255),
        notes varchar(MAX),
        reportsTo bigint REFERENCES employee(id)
    )`;
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.sql`DROP TABLE employee`;
  }
}
