import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeormAdapter } from '@rapiq/adapter-typeorm';
import type { IQuery } from '@rapiq/core';
import type { Repository } from 'typeorm';

import { CreateOrderDetail } from '../dto/create-order-detail.dto.js';
import { UpdateOrderDetail } from '../dto/update-order-detail.dto.js';
import { OrderDetail } from '../entities/order-detail.entity.js';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  findAll(orderId: number, filters: IQuery) {
    const queryBuilder =
      this.orderDetailRepository.createQueryBuilder('orderDetail');

    queryBuilder.where('orderDetail.orderId = :orderId', { orderId });

    const adapter = new TypeormAdapter({
      queryBuilder,
      relations: { joinAndSelect: true },
    });

    adapter.execute(filters);

    return queryBuilder.getManyAndCount();
  }

  findOne(orderId: number, productId: number) {
    return this.orderDetailRepository.findOneOrFail({
      where: { orderId, productId },
      relations: { product: true },
    });
  }

  create(orderId: number, createOrderDetail: CreateOrderDetail) {
    const detail = this.orderDetailRepository.create({
      order: { id: orderId } as OrderDetail['order'],
      product: {
        id: createOrderDetail.product as unknown as number,
      } as OrderDetail['product'],
      unitPrice: createOrderDetail.unitPrice,
      quantity: createOrderDetail.quantity,
      discount: createOrderDetail.discount,
    });

    return this.orderDetailRepository.save(detail);
  }

  update(detail: OrderDetail, updateOrderDetail: UpdateOrderDetail) {
    this.orderDetailRepository.merge(detail, updateOrderDetail);

    return this.orderDetailRepository.save(detail);
  }

  remove(detail: OrderDetail) {
    return this.orderDetailRepository.remove(detail);
  }
}
