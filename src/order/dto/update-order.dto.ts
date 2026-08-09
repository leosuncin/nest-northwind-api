import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateOrder {
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
}
