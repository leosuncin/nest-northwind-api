import { defineSchema } from '@rapiq/core';

import type { Supplier } from '../entities/supplier.entity';

export const querySupplierSchema = defineSchema<Supplier>({
  name: 'supplier',
  fields: {
    allowed: [
      'id',
      'companyName',
      'contactName',
      'contactTitle',
      'address',
      'city',
      'region',
      'postalCode',
      'country',
      'phone',
      'fax',
      'homePage',
    ],
  },
  filters: {
    allowed: [
      'companyName',
      'contactName',
      'contactTitle',
      'city',
      'region',
      'country',
      'phone',
      'fax',
    ],
  },
  sorts: {
    allowed: ['id', 'companyName', 'city', 'region', 'country'],
  },
  pagination: {
    maxLimit: 100,
  },
});
