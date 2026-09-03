import { defineSchema } from '@rapiq/core';

import type { Customer } from '../entities/customer.entity';

export const queryCustomerSchema = defineSchema<Customer>({
  name: 'customer',
  fields: {
    allowed: [
      'id',
      'code',
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
    ],
  },
  filters: {
    allowed: [
      'code',
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
    allowed: ['id', 'code', 'companyName', 'city', 'region', 'country'],
  },
  pagination: {
    maxLimit: 100,
  },
});
