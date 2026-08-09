import { Injectable, PipeTransform } from '@nestjs/common';

import { Order } from '../entities/order.entity';
import { OrderService } from '../services/order.service';

@Injectable()
export class OrderPipe implements PipeTransform {
  constructor(private readonly orderService: OrderService) {}

  transform(value: Order['id']) {
    return this.orderService.findOne(value);
  }
}
