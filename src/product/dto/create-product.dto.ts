import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { IsExistingCategory } from '../../category/validators/is-existing-category.validator.js';
import { IsExistingSupplier } from '../../supplier/validators/is-existing-supplier.validator.js';
import { Supplier } from '../../supplier/entities/supplier.entity.js';
import { Category } from '../../category/entities/category.entity.js';

export class CreateProduct {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  readonly name!: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @IsExistingSupplier()
  readonly supplier?: Supplier;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @IsExistingCategory()
  readonly category?: Category;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly quantityPerUnit?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly unitPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly unitsInStock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly unitsOnOrder?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly reorderLevel?: number;

  @IsOptional()
  @IsBoolean()
  readonly discontinued?: boolean;
}
