import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategory {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  readonly name!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(65535)
  readonly description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly picture?: string;
}
