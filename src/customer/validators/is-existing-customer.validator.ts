import { Injectable } from '@nestjs/common';
import {
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { isId } from '../../shared/utils/id.utils.js';
import { Customer } from '../entities/customer.entity.js';
import { CustomerService } from '../services/customer.service.js';

@Injectable()
@ValidatorConstraint({ name: 'ExistingCustomer', async: true })
export class IsExistingCustomerConstraint implements ValidatorConstraintInterface {
  constructor(private customerService: CustomerService) {}

  async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
    if (args.property === 'code') {
      if (typeof value !== 'string') {
        return false;
      }

      const exist = await this.customerService.exists({
        code: value,
        id:
          'id' in args.object && isId<Customer>(args.object.id)
            ? args.object.id
            : undefined,
      });

      return !exist;
    }

    if (!isId<Customer>(value)) {
      return false;
    }

    return this.customerService.exists({ id: value });
  }

  defaultMessage({ property }: ValidationArguments): string {
    return property === 'code'
      ? `Customer with code equal to $value exists`
      : `Customer with id equal to $value does not exist`;
  }
}

export const ExistingCustomer =
  (options?: ValidationOptions): PropertyDecorator =>
  (object, propertyKey) => {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyKey),
      options,
      validator: IsExistingCustomerConstraint,
    });
  };
