import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { Order } from '../entities/order.entity.js';
import { OrderService } from '../services/order.service.js';

@Injectable()
export class OrderPipe implements PipeTransform {
  constructor(private readonly orderService: OrderService) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      return this.orderService.findOne(value as Order['id']);
    }

    if (metadata.type === 'body') {
      const transformed = structuredClone(value as Record<string, unknown>);

      transformed.customer = { id: transformed.customer };
      transformed.employee = { id: transformed.employee };
      transformed.shipVia = transformed.shipVia
        ? { id: transformed.shipVia }
        : undefined;

      if (Array.isArray(transformed.details)) {
        transformed.details = transformed.details.map(
          (detail: Record<string, unknown>) =>
            Object.assign(detail, { product: { id: detail.product } }),
        );
      }

      return transformed;
    }

    return value;
  }
}
