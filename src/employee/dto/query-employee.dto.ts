import { defineSchema } from '@rapiq/core';

import type { Employee } from '../entities/employee.entity';

export const queryEmployeeSchema = defineSchema<Employee>({
  name: 'employee',
  fields: {
    allowed: [
      'id',
      'firstName',
      'lastName',
      'title',
      'titleOfCourtesy',
      'birthDate',
      'hireDate',
      'address',
      'city',
      'region',
      'postalCode',
      'country',
      'homePhone',
      'extension',
      'photo',
      'notes',
      'reportsTo',
    ],
    default: ['id', 'firstName', 'lastName', 'title', 'titleOfCourtesy'],
  },
  filters: {
    allowed: [
      'firstName',
      'lastName',
      'title',
      'titleOfCourtesy',
      'city',
      'region',
      'country',
      'homePhone',
      'extension',
    ],
  },
  sorts: {
    allowed: [
      'id',
      'firstName',
      'lastName',
      'title',
      'city',
      'region',
      'country',
      'hireDate',
    ],
    default: { id: 'DESC', lastName: 'DESC' },
  },
  relations: {
    allowed: ['reportsTo'],
  },
  schemaMapping: {
    reportsTo: 'reportsTo',
  },
  pagination: {
    maxLimit: 100,
  },
});
