import { Injectable } from '@nestjs/common';
import {
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { isId } from '../../shared/utils/id.utils.js';
import { Shipper } from '../entities/shipper.entity.js';
import { ShipperService } from '../services/shipper.service.js';

@Injectable()
@ValidatorConstraint({ name: 'IsExistingShipper', async: true })
export class IsExistingShipperConstraint implements ValidatorConstraintInterface {
  constructor(private shipperService: ShipperService) {}

  async validate(value: unknown): Promise<boolean> {
    if (!isId<Shipper>(value)) {
      return false;
    }

    return this.shipperService.exists(value);
  }

  defaultMessage(): string {
    return 'Shipper with id $value does not exist';
  }
}

export const IsExistingShipper =
  (options?: ValidationOptions): PropertyDecorator =>
  (object, propertyKey) => {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyKey),
      options,
      constraints: [true],
      name: 'IsExistingShipper',
      validator: IsExistingShipperConstraint,
    });
  };
