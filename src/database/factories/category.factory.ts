import { setSeederFactory } from 'typeorm-extension';

import { Category } from '../../category/entities/category.entity';

export const categoryFactory = setSeederFactory(Category, (faker) => {
  const category = new Category();

  category.name = faker.commerce.department().substring(0, 15);
  category.description = faker.commerce.productDescription();
  category.picture = faker.image.urlPicsumPhotos();

  return category;
});
