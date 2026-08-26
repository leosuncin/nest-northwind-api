import { ok } from 'node:assert/strict';

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { OrderDetailService } from '../services/order-detail.service';

function assertKeys(
  value: unknown,
): asserts value is { orderId: `${number}`; productId: `${number}` } {
  try {
    ok(typeof value === 'object' && value != null, 'Invalid object parameters');
    ok(
      'orderId' in value &&
        typeof value.orderId == 'string' &&
        Number.isSafeInteger(+value.orderId) &&
        +value.orderId > 0,
      'Invalid orderId key',
    );
    ok(
      'productId' in value &&
        typeof value.productId === 'string' &&
        Number.isSafeInteger(+value.productId) &&
        +value.productId > 0,
      'Invalid productId key',
    );
  } catch (error) {
    throw new BadRequestException(error);
  }
}

function hasProductProp(
  value: unknown,
): value is { product: number; [rest: string | symbol]: unknown } {
  return (
    typeof value === 'object' &&
    value != null &&
    'product' in value &&
    typeof value.product === 'number'
  );
}

@Injectable()
export class OrderDetailPipe implements PipeTransform {
  constructor(private readonly orderDetailService?: OrderDetailService) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      assertKeys(value);

      return this.orderDetailService?.findOne(+value.orderId, +value.productId);
    }

    if (metadata.type === 'body' && hasProductProp(value)) {
      const { product: _, ...modified } = {
        ...value,
        productId: value.product,
      };

      return modified;
    }

    return value;
  }
}
