import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ExistingCustomer } from '../validators/is-existing-customer.validator.js';

export class CreateCustomer {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  @ExistingCustomer()
  readonly code!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  readonly companyName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  readonly contactName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  readonly contactTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  readonly address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  readonly city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  readonly region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  readonly postalCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  readonly country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  readonly phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  readonly fax?: string;
}
