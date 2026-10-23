import { IsEmail, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100)
  name?: string;

  @IsOptional() @IsEmail()
  email?: string;

  // Obligatoire seulement si on change l'email
  @ValidateIf((o: UpdateProfileDto) => o.email !== undefined)
  @IsString() @MinLength(1)
  currentPassword?: string;
}
