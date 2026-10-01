import { defineSchema } from '@rapiq/core';

import type { Order } from '../entities/order.entity.js';

export const queryOrderSchema = defineSchema<Order>({
  name: 'order',
  fields: {
    allowed: [
      'id',
      'orderDate',
      'requiredDate',
      'shippedDate',
      'freight',
      'shipName',
      'shipAddress',
      'shipCity',
      'shipRegion',
      'shipPostalCode',
      'shipCountry',
    ],
    default: [
      'id',
      'orderDate',
      'requiredDate',
      'shippedDate',
      'freight',
      'shipName',
      'shipCity',
      'shipPostalCode',
      'shipCountry',
    ],
  },
  filters: {
    allowed: [
      'orderDate',
      'requiredDate',
      'shippedDate',
      'freight',
      'shipName',
      'shipAddress',
      'shipCity',
      'shipRegion',
      'shipPostalCode',
      'shipCountry',
    ],
  },
  sorts: {
    allowed: [
      'id',
      'orderDate',
      'requiredDate',
      'shippedDate',
      'freight',
      'shipName',
      'shipCity',
      'shipRegion',
      'shipPostalCode',
      'shipCountry',
    ],
    default: { orderDate: 'DESC' },
  },
  relations: {
    allowed: ['customer', 'employee', 'shipVia', 'details'],
  },
  pagination: {
    maxLimit: 100,
  },
});
