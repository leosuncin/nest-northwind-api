import { defineSchema } from '@rapiq/core';

import type { Shipper } from '../entities/shipper.entity.js';

export const queryShipperSchema = defineSchema<Shipper>({
  name: 'shipper',
  fields: {
    allowed: ['id', 'companyName', 'phone'],
  },
  filters: {
    allowed: ['companyName', 'phone'],
  },
  sorts: {
    allowed: ['id', 'companyName'],
  },
  pagination: {
    maxLimit: 100,
  },
});
