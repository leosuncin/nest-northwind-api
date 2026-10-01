import { defineSchema } from '@rapiq/core';

import type { Category } from '../entities/category.entity.js';

export const queryCategorySchema = defineSchema<Category>({
  name: 'category',
  fields: {
    allowed: ['id', 'name', 'description', 'picture'],
  },
  filters: {
    allowed: ['name', 'description'],
  },
  sorts: {
    allowed: ['id', 'name'],
  },
  pagination: {
    maxLimit: 100,
  },
});
