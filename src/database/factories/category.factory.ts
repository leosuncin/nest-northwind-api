import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { Category } from '../../category/entities/category.entity.js';

export const categoryFactory = setSeederFactory(Category, () => {
  const category = new Category();

  category.name = faker.commerce.department().substring(0, 15);
  category.description = faker.commerce.productDescription();
  category.picture = faker.image.urlPicsumPhotos();

  return category;
});
