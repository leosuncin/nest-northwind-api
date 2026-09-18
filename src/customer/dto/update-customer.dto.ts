import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

import { CreateCustomer } from './create-customer.dto.js';

export class UpdateCustomer extends PartialType(CreateCustomer) {
  @Allow()
  readonly id!: number;
}
