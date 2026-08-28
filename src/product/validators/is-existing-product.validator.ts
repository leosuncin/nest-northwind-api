import { Injectable } from '@nestjs/common';
import {
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { isId } from '../../shared/utils/id.utils.js';
import type { Product } from '../entities/product.entity.js';
import { ProductService } from '../services/product.service.js';

@Injectable()
@ValidatorConstraint({ name: 'IsExistingProduct', async: true })
export class IsExistingProductConstraint implements ValidatorConstraintInterface {
  constructor(private productService: ProductService) {}

  async validate(value: unknown): Promise<boolean> {
    if (!isId<Product>(value)) {
      return false;
    }

    return this.productService.exists(value);
  }

  defaultMessage(): string {
    return 'Product with id $value does not exist';
  }
}

export const IsExistingProduct =
  (options?: ValidationOptions): PropertyDecorator =>
  (object, propertyKey) => {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyKey),
      options,
      validator: IsExistingProductConstraint,
    });
  };
