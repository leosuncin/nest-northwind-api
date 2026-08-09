import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateOrderDetail } from '../dto/create-order-detail.dto';
import { UpdateOrderDetail } from '../dto/update-order-detail.dto';
import { OrderDetail } from '../entities/order-detail.entity';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  findAll(orderId: number) {
    return this.orderDetailRepository.find({
      where: { orderId },
      relations: { product: true },
    });
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

  update(
    orderId: number,
    productId: number,
    updateOrderDetail: UpdateOrderDetail,
  ) {
    return this.orderDetailRepository
      .findOneOrFail({
        where: { orderId, productId },
      })
      .then((detail) => {
        this.orderDetailRepository.merge(detail, updateOrderDetail);

        return this.orderDetailRepository.save(detail);
      });
  }

  remove(orderId: number, productId: number) {
    return this.orderDetailRepository
      .findOneOrFail({
        where: { orderId, productId },
      })
      .then((detail) => this.orderDetailRepository.remove(detail));
  }
}
