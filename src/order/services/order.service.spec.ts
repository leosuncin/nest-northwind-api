import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.vitest';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { OrderService } from './order.service.js';
import { Order } from '../entities/order.entity.js';
import { CreateOrder } from '../dto/create-order.dto.js';
import { UpdateOrder } from '../dto/update-order.dto.js';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Mocked<Repository<Order>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(OrderService).compile();

    service = unit;
    repository = unitRef.get(
      getRepositoryToken(Order) as string,
    ) as unknown as Mocked<Repository<Order>>;
  });

  test('given a valid dto when create then it creates and saves in order', async () => {
    const createOrder: CreateOrder = {
      customer: 1 as unknown as Order['customer'],
      employee: 1 as unknown as Order['employee'],
      details: [],
    };
    const createdOrder = { id: 1, ...createOrder } as Order;

    repository.create.mockReturnValue(createdOrder);
    repository.save.mockResolvedValue(createdOrder);

    const result = await service.create(createOrder);

    expect(result).toEqual(createdOrder);
    expect(repository.create).toHaveBeenCalledWith(createOrder);
    expect(repository.save).toHaveBeenCalledWith(createdOrder);
    expect(repository.create.mock.invocationCallOrder[0]).toBeLessThan(
      repository.save.mock.invocationCallOrder[0],
    );
  });

  test('given pagination params when findAll then it returns a paginated result', async () => {
    const page = 2;
    const limit = 5;
    const result: [Order[], number] = [[{ id: 1 } as Order], 1];

    repository.findAndCount.mockResolvedValue(result);

    const orders = await service.findAll(page, limit);

    expect(orders).toEqual(result);
    expect(repository.findAndCount).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });
  });

  test('given an id when findOne then it returns the matching order', async () => {
    const id = 1;
    const order = { id } as Order;

    repository.findOneOrFail.mockResolvedValue(order);

    const found = await service.findOne(id);

    expect(found).toEqual(order);
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

  test('given an order and changes when update then it merges and saves in order', async () => {
    const order = { id: 1 } as Order;
    const changes: UpdateOrder = { freight: 10 };

    repository.merge.mockReturnValue(order);
    repository.save.mockResolvedValue(order);

    const result = await service.update(order, changes);

    expect(result).toEqual(order);
    expect(repository.merge).toHaveBeenCalledWith(order, changes);
    expect(repository.save).toHaveBeenCalledWith(order);
    expect(repository.merge.mock.invocationCallOrder[0]).toBeLessThan(
      repository.save.mock.invocationCallOrder[0],
    );
  });

  test('given an order when remove then it removes and returns it', async () => {
    const order = { id: 1 } as Order;

    repository.remove.mockResolvedValue(order);

    const result = await service.remove(order);

    expect(result).toEqual(order);
    expect(repository.remove).toHaveBeenCalledWith(order);
  });
});
