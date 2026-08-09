import { getRepositoryToken } from '@nestjs/typeorm';
import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';
import type { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';
import { OrderService } from '../services/order.service';
import { OrderPipe } from './order.pipe';

describe('OrderPipe', () => {
  let pipe: OrderPipe;
  let repository: Mocked<Repository<Order>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.sociable(OrderPipe)
      .expose(OrderService)
      .compile();

    pipe = unit;
    repository = unitRef.get(
      getRepositoryToken(Order) as string,
    ) as unknown as Mocked<Repository<Order>>;
  });

  test('given an order id when transform then it returns the order from the service', async () => {
    const id = 1;
    const order = { id } as Order;

    repository.findOneOrFail.mockResolvedValue(order);

    const result = await pipe.transform(id);

    expect(result).toEqual(order);
    expect(repository.findOneOrFail).toHaveBeenCalledWith({
      where: { id },
      relations: {
        customer: true,
        employee: true,
        shipVia: true,
        details: { product: true },
      },
    });
  });
});
