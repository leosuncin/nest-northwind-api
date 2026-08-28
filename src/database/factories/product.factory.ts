import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { Product } from '../../product/entities/product.entity.js';
import {
  beverages,
  condiments,
  confections,
  dairyProducts,
  grainsCereals,
  meatPoultry,
  produce,
  seafood,
} from '../seeds/category.seeder.js';
import {
  auxJoyeuxEcclesiastiques,
  bigfootBreweries,
  cooperativaDeQuesosLasCabras,
  escargotsNouveaux,
  exoticLiquids,
  foretsDerables,
  formaggiFortiniSRL,
  gaiPaturage,
  gdayMate,
  grandmaKellysHomestead,
  heliSusswarenGmbHCoKG,
  karkkiOy,
  lekaTrading,
  lyngbysild,
  maMaison,
  mayumis,
  newEnglandSeafoodCannery,
  newOrleansCajunDelights,
  nordOstFischHandelsgesellschaftMbH,
  norskeMeierier,
  pastaButtiniSRL,
  pavlovaLtd,
  pbKnackebrodAB,
  plutzerLebensmittelgrossmarkteAG,
  refrescosAmericanasLTDA,
  specialtyBiscuitsLtd,
  svenskSjofoodaAB,
  tokyoTraders,
  zaanseSnoepfabriek,
} from '../seeds/supplier.seeder.js';

const categories = [
  beverages,
  condiments,
  confections,
  dairyProducts,
  grainsCereals,
  meatPoultry,
  produce,
  seafood,
];
const suppliers = [
  auxJoyeuxEcclesiastiques,
  bigfootBreweries,
  cooperativaDeQuesosLasCabras,
  escargotsNouveaux,
  exoticLiquids,
  foretsDerables,
  formaggiFortiniSRL,
  gaiPaturage,
  gdayMate,
  grandmaKellysHomestead,
  heliSusswarenGmbHCoKG,
  karkkiOy,
  lekaTrading,
  lyngbysild,
  maMaison,
  mayumis,
  newEnglandSeafoodCannery,
  newOrleansCajunDelights,
  nordOstFischHandelsgesellschaftMbH,
  norskeMeierier,
  pastaButtiniSRL,
  pavlovaLtd,
  pbKnackebrodAB,
  plutzerLebensmittelgrossmarkteAG,
  refrescosAmericanasLTDA,
  specialtyBiscuitsLtd,
  svenskSjofoodaAB,
  tokyoTraders,
  zaanseSnoepfabriek,
];

export const productFactory = setSeederFactory(Product, () => {
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
  product.supplier = faker.helpers.arrayElement(suppliers);
  product.category = faker.helpers.arrayElement(categories);

  return product;
});
