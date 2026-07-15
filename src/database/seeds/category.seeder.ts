import type { Seeder } from 'typeorm-extension';
import type { DataSource, Repository } from 'typeorm';

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

async function upsert(repository: Repository<Category>, category: Category) {
  const entity = await repository.findOne({
    where: { id: category.id },
    select: { id: true },
    order: { id: 'DESC' },
  });

  if (entity) {
    const { id, ...partialEntity } = category;
    await repository.update({ id }, partialEntity);
  } else {
    await repository.insert(category);
  }
}

export default class CategorySeeder implements Seeder {
  async run(dataSource: DataSource) {
    await dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Category);

      await upsert(repository, beverages);
      await upsert(repository, condiments);
      await upsert(repository, confections);
      await upsert(repository, dairyProducts);
      await upsert(repository, grainsCereals);
      await upsert(repository, meatPoultry);
      await upsert(repository, produce);
      await upsert(repository, seafood);
    });
  }
}
