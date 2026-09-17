import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

import { Product } from '../../product/entities/product.entity.js';
import { IsExistingProduct } from '../../product/validators/is-existing-product.validator.js';

export class CreateOrderDetail {
  @IsDefined()
  @IsInt()
  @IsPositive()
  @IsExistingProduct()
  readonly product!: Product;

  @IsDefined()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) =>
    Number.isFinite(value)
      ? Math.round((value + Number.EPSILON) * 100) / 100
      : value,
  )
  readonly unitPrice!: number;

  @IsDefined()
  @IsInt()
  @Min(1)
  readonly quantity!: number;

  @IsDefined()
  @IsNumber()
  @Min(0)
  @Max(1)
  readonly discount!: number;
}
