import { setSeederFactory } from 'typeorm-extension';

import { Product } from '../../product/entities/product.entity';

export const productFactory = setSeederFactory(Product, (faker) => {
  const product = new Product();

  product.name = faker.commerce.productName().substring(0, 40);
  product.quantityPerUnit = faker.string
    .alpha({ length: { min: 3, max: 20 } })
    .substring(0, 20);
  product.unitPrice = faker.number.float({
    min: 0,
    max: 999,
    fractionDigits: 2,
  });
  product.unitsInStock = faker.number.int({ min: 0, max: 1000 });
  product.unitsOnOrder = faker.number.int({ min: 0, max: 1000 });
  product.reorderLevel = faker.number.int({ min: 0, max: 32767 });
  product.discontinued = faker.datatype.boolean();

  return product;
});
