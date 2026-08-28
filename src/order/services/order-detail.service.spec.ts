import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/doubles.vitest';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { OrderDetailService } from './order-detail.service.js';
import { OrderDetail } from '../entities/order-detail.entity.js';
import { CreateOrderDetail } from '../dto/create-order-detail.dto.js';
import { UpdateOrderDetail } from '../dto/update-order-detail.dto.js';

describe('OrderDetailService', () => {
  let service: OrderDetailService;
  let orderDetailRepository: Mocked<Repository<OrderDetail>>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(OrderDetailService).compile();

    service = unit;
    orderDetailRepository = unitRef.get(
      getRepositoryToken(OrderDetail) as string,
    ) as unknown as Mocked<Repository<OrderDetail>>;
  });

  test('given an orderId when findAll then it returns the order details', async () => {
    const orderId = 1;
    const details = [{ orderId, productId: 1 } as OrderDetail];

    void orderDetailRepository.find.mockResolvedValue(details);

    const result = await service.findAll(orderId);

    expect(result).toEqual(details);
    expect(orderDetailRepository.find).toHaveBeenCalledWith({
      where: { orderId },
      relations: { product: true },
    });
  });

  test('given an orderId and productId when findOne then it returns the matching detail', async () => {
    const orderId = 1;
    const productId = 2;
    const detail = { orderId, productId } as OrderDetail;

    void orderDetailRepository.findOneOrFail.mockResolvedValue(detail);

    const result = await service.findOne(orderId, productId);

    expect(result).toEqual(detail);
    expect(orderDetailRepository.findOneOrFail).toHaveBeenCalledWith({
      where: { orderId, productId },
      relations: { product: true },
    });
  });

  test('given an orderId and a valid dto when create then it persists the detail', async () => {
    const orderId = 1;
    const createDto: CreateOrderDetail = {
      product: 2 as unknown as OrderDetail['product'],
      unitPrice: 10,
      quantity: 5,
      discount: 0,
    };
    const createdDetail = {
      orderId,
      productId: 2,
      unitPrice: 10,
      quantity: 5,
      discount: 0,
    } as OrderDetail;

    orderDetailRepository.create.mockReturnValue(createdDetail);
    void orderDetailRepository.save.mockResolvedValue(createdDetail);

    const result = await service.create(orderId, createDto);

    expect(result).toEqual(createdDetail);
    expect(orderDetailRepository.create).toHaveBeenCalled();
    expect(orderDetailRepository.save).toHaveBeenCalledWith(createdDetail);
    expect(
      orderDetailRepository.create.mock.invocationCallOrder[0],
    ).toBeLessThan(orderDetailRepository.save.mock.invocationCallOrder[0]);
  });

  test('given an orderId and productId and changes when update then it merges and saves', async () => {
    const orderId = 1;
    const productId = 2;
    const existing = { orderId, productId, quantity: 1 } as OrderDetail;
    const changes: UpdateOrderDetail = { quantity: 5 };

    orderDetailRepository.merge.mockReturnValue(existing);
    void orderDetailRepository.save.mockResolvedValue(existing);

    const result = await service.update(existing, changes);

    expect(result).toEqual(existing);
    expect(orderDetailRepository.merge).toHaveBeenCalledWith(existing, changes);
    expect(orderDetailRepository.save).toHaveBeenCalledWith(existing);
  });

  test('given an orderId and productId when remove then it removes and returns the detail', async () => {
    const orderId = 1;
    const productId = 2;
    const detail = { orderId, productId } as OrderDetail;

    void orderDetailRepository.remove.mockResolvedValue(detail);

    const result = await service.remove(detail);

    expect(result).toEqual(detail);
    expect(orderDetailRepository.remove).toHaveBeenCalledWith(detail);
  });
});
