import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateArtisanDto {
  @IsString() @MinLength(2) @MaxLength(100)
  name: string;

  @IsString() @MinLength(2) @MaxLength(50)
  trade: string;

  @IsString() @MinLength(2) @MaxLength(100)
  neighborhood: string;

  @IsString() @MinLength(2) @MaxLength(100)
  city: string;

  // On retire espaces, points, tirets et parenthèses : "034 12 345 67" -> "0341234567"
  @Transform(({ value }) => (typeof value === 'string' ? value.replace(/[\s.\-()]/g, '') : value))
  @Matches(/^\+?\d{6,15}$/, { message: 'Numéro de téléphone invalide' })
  phone: string;

  @IsOptional() @IsString() @MaxLength(300)
  description?: string;
}
