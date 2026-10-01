import type { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import categoryFixtures from './category.json' with { type: 'json' };

const categoryJsonFixtures = JSON.stringify(categoryFixtures, (_key, value) =>
  typeof value === 'boolean' ? (value ? 1 : 0) : (value as unknown),
);

export default class CategorySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.transaction(async (manager) => {
      await manager.sql`ALTER TABLE category NOCHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT category ON;

      MERGE INTO category AS target
      USING OPENJSON(${categoryJsonFixtures}) WITH (
        id bigint,
        name varchar(15),
        description varchar(MAX)
      ) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET
          name = source.name,
          description = source.description
      WHEN NOT MATCHED THEN
        INSERT (id, name, description)
        VALUES (source.id, source.name, source.description);

      ALTER TABLE category CHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT category OFF`;
    });
  }
}
