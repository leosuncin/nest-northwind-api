import type { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Category } from '../../category/entities/category.entity';

export const beverages = Object.assign<Category, Partial<Category>>(
  new Category(),
  {
    id: 1,
    name: 'Beverages',
    description: 'Soft drinks, coffees, teas, beers, and ales',
  },
);

export const condiments = Object.assign<Category, Partial<Category>>(
  new Category(),
  {
    id: 2,
    name: 'Condiments',
    description: 'Sweet and savory sauces, relishes, spreads, and seasonings',
  },
);

export const confections = Object.assign<Category, Partial<Category>>(
  new Category(),
  {
    id: 3,
    name: 'Confections',
    description: 'Desserts, candies, and sweet breads',
  },
);

export const dairyProducts = Object.assign<Category, Partial<Category>>(
  new Category(),
  {
    id: 4,
    name: 'Dairy Products',
    description: 'Cheeses',
  },
);

export const grainsCereals = Object.assign<Category, Partial<Category>>(
  new Category(),
  {
    id: 5,
    name: 'Grains/Cereals',
    description: 'Breads, crackers, pasta, and cereal',
  },
);

export const meatPoultry = Object.assign<Category, Partial<Category>>(
  new Category(),
  {
    id: 6,
    name: 'Meat/Poultry',
    description: 'Prepared meats',
  },
);

export const produce = Object.assign<Category, Partial<Category>>(
  new Category(),
  {
    id: 7,
    name: 'Produce',
    description: 'Dried fruit and bean curd',
  },
);

export const seafood = Object.assign<Category, Partial<Category>>(
  new Category(),
  {
    id: 8,
    name: 'Seafood',
    description: 'Seaweed and fish',
  },
);

const categoryJsonFixtures = JSON.stringify(
  [
    beverages,
    condiments,
    confections,
    dairyProducts,
    grainsCereals,
    meatPoultry,
    produce,
    seafood,
  ],
  (_key, value) => {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value as unknown;
  },
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
