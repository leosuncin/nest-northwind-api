import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.vitest';

import { OrderController } from './order.controller.js';
import { OrderService } from '../services/order.service.js';
import { CreateOrder } from '../dto/create-order.dto.js';
import { UpdateOrder } from '../dto/update-order.dto.js';
import { Order } from '../entities/order.entity.js';

describe('OrderController', () => {
  let controller: OrderController;
  let service: Mocked<OrderService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(OrderController).compile();

    controller = unit;
    service = unitRef.get(OrderService) as unknown as Mocked<OrderService>;
  });

  test('given a valid dto when create then it delegates to the service', async () => {
    const createOrder: CreateOrder = {
      customer: 1 as unknown as Order['customer'],
      employee: 1 as unknown as Order['employee'],
      details: [],
    };
    const createdOrder = { id: 1, ...createOrder } as Order;

    service.create.mockResolvedValue(createdOrder);

    const result = await controller.create(createOrder);

    expect(result).toEqual(createdOrder);
    expect(service.create).toHaveBeenCalledWith(createOrder);
  });

  test('given a page and limit when findAll then it delegates to the service', async () => {
    const page = 2;
    const limit = 5;
    const orders: [Order[], number] = [[{ id: 1 } as Order], 1];

    service.findAll.mockResolvedValue(orders);

    const result = await controller.findAll(page, limit);

    expect(result).toEqual(orders);
    expect(service.findAll).toHaveBeenCalledWith(page, limit);
  });

  test('given an id when findOne then it delegates to the service', async () => {
    const id = 1;
    const order = { id } as Order;

    service.findOne.mockResolvedValue(order);

    const result = await controller.findOne(id);

    expect(result).toEqual(order);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  test('given an order and changes when update then it delegates to the service', async () => {
    const order = { id: 1 } as Order;
    const changes: UpdateOrder = { freight: 10 };

    const updated = { ...order, ...changes } as Order;

    service.update.mockResolvedValue(updated);

    const result = await controller.update(order, changes);

    expect(result).toEqual(updated);
    expect(service.update).toHaveBeenCalledWith(order, changes);
  });

  test('given an order when remove then it delegates to the service', async () => {
    const order = { id: 1 } as Order;

    service.remove.mockResolvedValue(order);

    const result = await controller.remove(order);

    expect(result).toEqual(order);
    expect(service.remove).toHaveBeenCalledWith(order);
  });
});
