import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { Customer } from '../../customer/entities/customer.entity.js';

export const customerFactory = setSeederFactory(Customer, () => {
  const customer = new Customer();

  customer.code = faker.string.alphanumeric(5);
  customer.companyName = faker.company.name().substring(0, 40);
  customer.contactName = faker.person.fullName().substring(0, 30);
  customer.contactTitle = faker.person.jobTitle().substring(0, 30);
  customer.address = faker.location.streetAddress().substring(0, 60);
  customer.city = faker.location.city().substring(0, 15);
  customer.region = faker.location.state().substring(0, 15);
  customer.postalCode = faker.location.zipCode().substring(0, 10);
  customer.country = faker.location.country().substring(0, 15);
  customer.phone = faker.phone.number().substring(0, 24);
  customer.fax = faker.phone.number().substring(0, 24);

  return customer;
});
