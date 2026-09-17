import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { Product } from '../../product/entities/product.entity.js';
import categoryFixtures from '../seeds/category.json';
import supplierFixtures from '../seeds/supplier.json';

const suppliers = Object.values(supplierFixtures);
const categories = Object.values(categoryFixtures);

export const productFactory = setSeederFactory(Product, () => {
  const product = new Product();

  product.name = faker.commerce.productName().substring(0, 40);
  product.quantityPerUnit = faker.string
    .alpha({ length: { min: 3, max: 20 } })
    .substring(0, 20);
  product.unitPrice = +faker.finance.amount({
    min: 0,
    max: 999,
    dec: 2,
  });
  product.unitsInStock = faker.number.int({ min: 0, max: 1000 });
  product.unitsOnOrder = faker.number.int({ min: 0, max: 1000 });
  product.reorderLevel = faker.number.int({ min: 0, max: 32767 });
  product.discontinued = faker.datatype.boolean();
  product.supplier = faker.helpers.arrayElement(suppliers);
  product.category = faker.helpers.arrayElement(categories);

  return product;
});
