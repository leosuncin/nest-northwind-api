import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { Order } from '../../order/entities/order.entity.js';
import customerFixtures from '../seeds/customer.json';
import employeeFixtures from '../seeds/employee.json';
import shipperFixtures from '../seeds/shipper.json';
import { Employee } from '../../employee/entities/employee.entity.js';

const customers = Object.values(customerFixtures);
const employees = Object.values(employeeFixtures);
const shippers = Object.values(shipperFixtures);

export const orderFactory = setSeederFactory(Order, () => {
  const order = new Order();

  order.customer = faker.helpers.arrayElement(customers);
  order.employee = faker.helpers.arrayElement(employees) as unknown as Employee;
  order.orderDate = faker.date.past({ years: 3 });
  order.requiredDate = faker.date.future({ years: 1 });
  order.shippedDate = faker.date.recent({ days: 30 });
  order.shipVia = faker.helpers.arrayElement(shippers);
  order.freight = faker.number.float({ min: 0, max: 999, fractionDigits: 2 });
  order.shipName = faker.company.name().substring(0, 40);
  order.shipAddress = faker.location.streetAddress().substring(0, 60);
  order.shipCity = faker.location.city().substring(0, 15);
  order.shipRegion = faker.helpers.maybe(() =>
    faker.location.state().substring(0, 15),
  );
  order.shipPostalCode = faker.location.zipCode().substring(0, 10);
  order.shipCountry = faker.location.country().substring(0, 15);

  return order;
});
