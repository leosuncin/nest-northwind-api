import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeormAdapter } from '@rapiq/adapter-typeorm';
import type { IQuery } from '@rapiq/core';
import type { Repository } from 'typeorm';

import { CreateOrder } from '../dto/create-order.dto.js';
import { UpdateOrder } from '../dto/update-order.dto.js';
import { Order } from '../entities/order.entity.js';

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

  findAll(filters: IQuery) {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    const adapter = new TypeormAdapter({
      queryBuilder,
      relations: { joinAndSelect: true },
    });

    adapter.execute(filters);

    return queryBuilder.getManyAndCount();
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
