import type { Mocked } from '@suites/doubles.vitest';
import { TestBed } from '@suites/unit';

import { Product } from '../../product/entities/product.entity';
import { CreateOrderDetail } from '../dto/create-order-detail.dto';
import { UpdateOrderDetail } from '../dto/update-order-detail.dto';
import { OrderDetail } from '../entities/order-detail.entity';
import { OrderDetailService } from '../services/order-detail.service';
import { OrderDetailController } from './order-detail.controller';

describe('OrderDetailController', () => {
  let controller: OrderDetailController;
  let service: Mocked<OrderDetailService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(
      OrderDetailController,
    ).compile();

    controller = unit;
    service = unitRef.get(
      OrderDetailService,
    ) as unknown as Mocked<OrderDetailService>;
  });

  test('given an orderId when findAll then it delegates to the service', async () => {
    const orderId = 1;
    const orderDetails: OrderDetail[] = [
      { orderId, productId: 1 } as OrderDetail,
    ];

    void service.findAll.mockResolvedValue(orderDetails);

    const result = await controller.findAll(orderId);

    expect(result).toEqual(orderDetails);
    expect(service.findAll).toHaveBeenCalledWith(orderId);
  });

  test('given an orderDetail when findOne then it returns the orderDetail', () => {
    const orderDetail = { orderId: 1, productId: 1 } as OrderDetail;

    const result = controller.findOne(orderDetail);

    expect(result).toEqual(orderDetail);
  });

  test('given an orderId and a valid dto when create then it delegates to the service', async () => {
    const orderId = 1;
    const createOrderDetail: CreateOrderDetail = {
      product: 1 as unknown as Product,
      unitPrice: 10,
      quantity: 2,
      discount: 0,
    };
    const createdOrderDetail = { orderId, ...createOrderDetail } as OrderDetail;

    void service.create.mockResolvedValue(createdOrderDetail);

    const result = await controller.create(orderId, createOrderDetail);

    expect(result).toEqual(createdOrderDetail);
    expect(service.create).toHaveBeenCalledWith(orderId, createOrderDetail);
  });

  test('given an orderDetail and changes when update then it delegates to the service', async () => {
    const orderDetail = { orderId: 1, productId: 1 } as OrderDetail;
    const changes: UpdateOrderDetail = { quantity: 5 };

    const updated = { ...orderDetail, ...changes } as OrderDetail;

    void service.update.mockResolvedValue(updated);

    const result = await controller.update(orderDetail, changes);

    expect(result).toEqual(updated);
    expect(service.update).toHaveBeenCalledWith(orderDetail, changes);
  });

  test('given an orderDetail when remove then it delegates to the service', async () => {
    const orderDetail = { orderId: 1, productId: 1 } as OrderDetail;

    void service.remove.mockResolvedValue(orderDetail);

    const result = await controller.remove(orderDetail);

    expect(result).toEqual(orderDetail);
    expect(service.remove).toHaveBeenCalledWith(orderDetail);
  });
});
