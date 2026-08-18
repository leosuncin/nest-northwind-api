import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDateString,
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { Customer } from '../../customer/entities/customer.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { IsExistingCustomer } from '../../customer/validators/is-existing-customer.validator';
import { IsExistingEmployee } from '../../employee/validators/is-existing-employee.validator';
import { IsExistingShipper } from '../../shipper/validators/is-existing-shipper.validator';
import { Shipper } from '../../shipper/entities/shipper.entity';
import { CreateOrderDetail } from './create-order-detail.dto';

export class CreateOrder {
  @IsDefined()
  @IsInt()
  @IsPositive()
  @IsExistingCustomer()
  readonly customer!: Customer;

  @IsDefined()
  @IsInt()
  @IsPositive()
  @IsExistingEmployee()
  readonly employee!: Employee;

  @IsOptional()
  @IsDateString()
  readonly orderDate?: string;

  @IsOptional()
  @IsDateString()
  readonly requiredDate?: string;

  @IsOptional()
  @IsDateString()
  readonly shippedDate?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @IsExistingShipper()
  readonly shipVia?: Shipper;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly freight?: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  readonly shipName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  readonly shipAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  readonly shipCity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  readonly shipRegion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  readonly shipPostalCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  readonly shipCountry?: string;

  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetail)
  readonly details: CreateOrderDetail[] = [];
}
