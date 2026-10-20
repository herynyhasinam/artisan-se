import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateArtisanDto {
  @IsString() @MinLength(2) @MaxLength(100)
  name: string;

  @IsString() @MinLength(2) @MaxLength(50)
  trade: string;

  @IsString() @MinLength(2) @MaxLength(100)
  neighborhood: string;

  @IsString() @MinLength(2) @MaxLength(100)
  city: string;

  @IsString() @MinLength(6) @MaxLength(20)
  phone: string;

  @IsOptional() @IsString() @MaxLength(300)
  description?: string;

  @IsBoolean()
  consent: boolean;
}
