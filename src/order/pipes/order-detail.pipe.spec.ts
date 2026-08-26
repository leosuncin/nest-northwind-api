import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.vitest';

import { OrderDetailPipe } from './order-detail.pipe';
import { OrderDetailService } from '../services/order-detail.service';
import { OrderDetail } from '../entities/order-detail.entity';

describe('OrderDetailPipe', () => {
  let pipe: OrderDetailPipe;
  let serviceMock: Mocked<OrderDetailService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(OrderDetailPipe).compile();

    pipe = unit;
    serviceMock = unitRef.get(
      OrderDetailService,
    ) as unknown as Mocked<OrderDetailService>;
  });

  test('given the route parameters when the order details exist then it transform it to an order detail', async () => {
    void serviceMock.findOne.mockResolvedValue(new OrderDetail());

    const detail = await pipe.transform(
      { orderId: '10248', productId: '11' },
      { type: 'param' },
    );

    expect(detail).toBeDefined();
    expect(serviceMock.findOne).toHaveBeenCalledWith(10248, 11);
  });

  test('given the body when the order details exist then it transform it as the same', async () => {
    const detail = await pipe.transform(
      { discount: 0.1, product: 11 },
      { type: 'body' },
    );

    expect(detail).toBeDefined();
    expect(detail).toEqual({ discount: 0.1, productId: 11 });
    expect(serviceMock.findOne).not.toHaveBeenCalled();
  });
});
