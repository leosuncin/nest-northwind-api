import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CreateOrder } from '../dto/create-order.dto';
import { UpdateOrder } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  create(createOrder: CreateOrder) {
    const order = this.orderRepository.create(createOrder);

    return this.orderRepository.save(order);
  }

  findAll(page = 1, limit = 10) {
    return this.orderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.orderRepository.findOneOrFail({
      where: { id },
      relations: {
        customer: true,
        employee: true,
        shipVia: true,
        details: { product: true },
      },
    });
  }

  update(order: Order, updateOrder: UpdateOrder) {
    this.orderRepository.merge(order, updateOrder);

    return this.orderRepository.save(order);
  }

  remove(order: Order) {
    return this.orderRepository.remove(order);
  }
}
