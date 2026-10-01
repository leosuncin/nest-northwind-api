import { defineSchema, eq } from '@rapiq/core';

import type { Product } from '../entities/product.entity.js';

export const queryProductSchema = defineSchema<Product>({
  name: 'product',
  fields: {
    allowed: [
      'id',
      'name',
      'quantityPerUnit',
      'unitPrice',
      'unitsInStock',
      'unitsOnOrder',
      'reorderLevel',
      'discontinued',
    ],
    default: [
      'name',
      'quantityPerUnit',
      'unitPrice',
      'unitsInStock',
      'unitsOnOrder',
    ],
  },
  filters: {
    allowed: [
      'name',
      'quantityPerUnit',
      'unitPrice',
      'unitsInStock',
      'unitsOnOrder',
      'reorderLevel',
      'discontinued',
    ],
    default: eq<Product>('discontinued', false),
  },
  sorts: {
    allowed: ['id', 'name', 'unitPrice', 'unitsInStock', 'discontinued'],
    default: { name: 'DESC' },
  },
  relations: {
    allowed: ['supplier', 'category'],
  },
  pagination: {
    maxLimit: 100,
  },
});
