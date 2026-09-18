import { Injectable } from '@nestjs/common';
import {
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { isId } from '../../shared/utils/id.utils.js';
import { Customer } from '../entities/customer.entity.js';
import { CustomerService } from '../services/customer.service.js';

@Injectable()
@ValidatorConstraint({ name: 'IsExistingCustomer', async: true })
export class IsExistingCustomerConstraint implements ValidatorConstraintInterface {
  constructor(private customerService: CustomerService) {}

  async validate(value: unknown): Promise<boolean> {
    if (!isId<Customer>(value)) {
      return false;
    }

    return this.customerService.exists({ id: value });
  }

  defaultMessage(): string {
    return 'Customer with id equal to $value does not exist';
  }
}

export const IsExistingCustomer =
  (options?: ValidationOptions): PropertyDecorator =>
  (object, propertyKey) => {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyKey),
      options,
      validator: IsExistingCustomerConstraint,
    });
  };
