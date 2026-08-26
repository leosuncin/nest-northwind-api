import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

import { Product } from '../../product/entities/product.entity';
import { IsExistingProduct } from '../../product/validators/is-existing-product.validator';

export class UpdateOrderDetail {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @IsExistingProduct()
  readonly product?: Product;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly unitPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  readonly discount?: number;
}
