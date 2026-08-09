import { setSeederFactory } from 'typeorm-extension';

import { OrderDetail } from '../../order/entities/order-detail.entity';

export const orderDetailFactory = setSeederFactory(OrderDetail, (faker) => {
  const detail = new OrderDetail();

  detail.unitPrice = faker.number.float({
    min: 0,
    max: 999,
    fractionDigits: 2,
  });
  detail.quantity = faker.number.int({ min: 1, max: 100 });
  detail.discount = faker.number.float({ min: 0, max: 1, fractionDigits: 2 });

  return detail;
});
