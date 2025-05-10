import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
