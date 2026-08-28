import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { Supplier } from '../../supplier/entities/supplier.entity.js';

export const supplierFactory = setSeederFactory(Supplier, () => {
  const supplier = new Supplier();

  supplier.companyName = faker.company.name().substring(0, 40);
  supplier.contactName = faker.person.fullName().substring(0, 30);
  supplier.contactTitle = faker.person.jobTitle().substring(0, 30);
  supplier.address = faker.location.streetAddress().substring(0, 60);
  supplier.city = faker.location.city().substring(0, 15);
  supplier.region = faker.location.state().substring(0, 15);
  supplier.postalCode = faker.location.zipCode().substring(0, 10);
  supplier.country = faker.location.country().substring(0, 15);
  supplier.phone = faker.phone.number().substring(0, 24);
  supplier.fax = faker.phone.number().substring(0, 24);
  supplier.homePage = faker.internet.url().substring(0, 255);

  return supplier;
});
