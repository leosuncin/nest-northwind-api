import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateShipper {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  readonly companyName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  readonly phone?: string;
}
