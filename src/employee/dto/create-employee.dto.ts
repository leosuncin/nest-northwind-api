import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsString,
  MaxLength,
  IsOptional,
  IsNotEmpty,
  IsDate,
} from 'class-validator';

export class CreateEmployee {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  readonly firstName!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  readonly lastName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  readonly titleOfCourtesy?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  readonly birthDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  readonly hireDate?: Date;

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
  readonly homePhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  readonly extension?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly photo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(65535)
  readonly notes?: string;
}
