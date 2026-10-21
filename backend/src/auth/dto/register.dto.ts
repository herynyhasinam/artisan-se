import { Transform } from 'class-transformer';
import {
  IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf,
} from 'class-validator';

const isArtisan = (o: RegisterDto) => o.accountType === 'ARTISAN';

export class RegisterDto {
  @IsString() @MinLength(2) @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  // bcrypt ignore tout ce qui dépasse 72 caractères
  @IsString() @MinLength(8) @MaxLength(72)
  password: string;

  @IsOptional() @IsIn(['USER', 'ARTISAN'])
  accountType?: 'USER' | 'ARTISAN';

  // --- Champs de la fiche : obligatoires seulement pour un compte ARTISAN ---
  @ValidateIf(isArtisan) @IsString() @MinLength(2) @MaxLength(50)
  trade?: string;

  @ValidateIf(isArtisan) @IsString() @MinLength(2) @MaxLength(100)
  neighborhood?: string;

  @ValidateIf(isArtisan) @IsString() @MinLength(2) @MaxLength(100)
  city?: string;

  @ValidateIf(isArtisan)
  @Transform(({ value }) => (typeof value === 'string' ? value.replace(/[\s.\-()]/g, '') : value))
  @Matches(/^\+?\d{6,15}$/, { message: 'Numéro de téléphone invalide' })
  phone?: string;

  @IsOptional() @IsString() @MaxLength(300)
  description?: string;
}
