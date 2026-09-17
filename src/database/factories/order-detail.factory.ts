import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { OrderDetail } from '../../order/entities/order-detail.entity.js';

export const orderDetailFactory = setSeederFactory(OrderDetail, () => {
  const detail = new OrderDetail();

  detail.unitPrice = +faker.finance.amount({
    min: 0,
    max: 999,
    dec: 2,
  });
  detail.quantity = faker.number.int({ min: 1, max: 100 });
  detail.discount = faker.number.float({ min: 0, max: 1, fractionDigits: 2 });

  return detail;
});
