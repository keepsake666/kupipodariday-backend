import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;
  @IsString()
  @Length(2, 200)
  about?: string;
  @IsString()
  @IsUrl()
  avatar: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
