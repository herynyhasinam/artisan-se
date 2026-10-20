import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @MinLength(2) @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  // bcrypt ignore tout ce qui dépasse 72 caractères
  @IsString() @MinLength(8) @MaxLength(72)
  password: string;
}
