import {
  IsDefined,
  IsInt,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

import { IsExistingProduct } from '../../product/validators/is-existing-product.validator';
import { Product } from '../../product/entities/product.entity';

export class CreateOrderDetail {
  @IsDefined()
  @IsInt()
  @IsPositive()
  @IsExistingProduct()
  readonly product!: Product;

  @IsDefined()
  @IsNumber()
  @Min(0)
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
