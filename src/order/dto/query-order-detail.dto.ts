import { defineSchema } from '@rapiq/core';

import type { OrderDetail } from '../entities/order-detail.entity.js';

export const queryOrderDetailSchema = defineSchema<OrderDetail>({
  name: 'order-detail',
  fields: {
    allowed: ['orderId', 'productId', 'unitPrice', 'quantity', 'discount'],
    default: ['orderId', 'productId', 'unitPrice', 'quantity', 'discount'],
  },
  filters: {
    allowed: ['unitPrice', 'quantity', 'discount'],
  },
  sorts: {
    allowed: ['orderId', 'productId', 'unitPrice', 'quantity', 'discount'],
    default: { orderId: 'ASC', productId: 'ASC' },
  },
  relations: {
    allowed: ['order', 'product'],
  },
  pagination: {
    maxLimit: 100,
  },
});
