import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProduct {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  readonly name!: string;

  @IsOptional()
  @IsInt()
  readonly supplierId?: number;

  @IsOptional()
  @IsInt()
  readonly categoryId?: number;

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
