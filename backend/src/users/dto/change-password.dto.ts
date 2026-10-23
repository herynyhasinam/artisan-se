import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString() @MinLength(1)
  currentPassword: string;

  // bcrypt ignore tout ce qui dépasse 72 caractères
  @IsString() @MinLength(8) @MaxLength(72)
  newPassword: string;
}
