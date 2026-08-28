import { Injectable } from '@nestjs/common';
import {
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { isId } from '../../shared/utils/id.utils.js';
import { Category } from '../entities/category.entity.js';
import { CategoryService } from '../services/category.service.js';

@Injectable()
@ValidatorConstraint({ name: 'IsExistingCategory', async: true })
export class IsExistingCategoryConstraint implements ValidatorConstraintInterface {
  constructor(private categoryService: CategoryService) {}

  async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
    if (!isId<Category>(value)) {
      return false;
    }

    const [shouldExist = true] = args.constraints as [shouldExist: boolean];
    const exists = await this.categoryService.exists(value);

    return shouldExist ? exists : !exists;
  }

  defaultMessage(args: ValidationArguments): string {
    const [shouldExist = true] = args.constraints as [shouldExist: boolean];

    return shouldExist
      ? 'Category with id $value does not exist'
      : 'Category with id $value already exists';
  }
}

export const IsExistingCategory =
  (options?: ValidationOptions): PropertyDecorator =>
  (object, propertyKey) => {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyKey),
      options,
      constraints: [true],
      name: 'IsExistingCategory',
      validator: IsExistingCategoryConstraint,
    });
  };

export const IsNotExistingCategory =
  (options?: ValidationOptions): PropertyDecorator =>
  (object, propertyKey) => {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyKey),
      options,
      constraints: [false],
      name: 'IsNotExistingCategory',
      validator: IsExistingCategoryConstraint,
    });
  };
