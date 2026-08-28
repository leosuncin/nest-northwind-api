import { Injectable } from '@nestjs/common';
import {
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { isId } from '../../shared/utils/id.utils.js';
import { Supplier } from '../entities/supplier.entity.js';
import { SupplierService } from '../services/supplier.service.js';

@Injectable()
@ValidatorConstraint({ name: 'IsExistingSupplier', async: true })
export class IsExistingSupplierConstraint implements ValidatorConstraintInterface {
  constructor(private supplierService: SupplierService) {}

  async validate(value: unknown): Promise<boolean> {
    if (!isId<Supplier>(value)) {
      return false;
    }

    return this.supplierService.exists(value);
  }

  defaultMessage(): string {
    return 'Supplier with id $value does not exist';
  }
}

export const IsExistingSupplier =
  (options?: ValidationOptions): PropertyDecorator =>
  (object, propertyKey) => {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyKey),
      options,
      validator: IsExistingSupplierConstraint,
    });
  };
