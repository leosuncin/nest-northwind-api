import { Injectable } from '@nestjs/common';
import {
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

import { isId } from '../../shared/utils/id.utils';
import { Employee } from '../entities/employee.entity';
import { EmployeeService } from '../services/employee.service';

@Injectable()
@ValidatorConstraint({ name: 'IsExistingEmployee', async: true })
export class IsExistingEmployeeConstraint implements ValidatorConstraintInterface {
  constructor(private employeeService: EmployeeService) {}

  async validate(value: unknown): Promise<boolean> {
    if (!isId<Employee>(value)) {
      return false;
    }

    return this.employeeService.exists(value);
  }

  defaultMessage(): string {
    return 'Employee with id $value does not exist';
  }
}

export const IsExistingEmployee =
  (options?: ValidationOptions): PropertyDecorator =>
  (object, propertyKey) => {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyKey),
      options,
      constraints: [true],
      name: 'IsExistingEmployee',
      validator: IsExistingEmployeeConstraint,
    });
  };
