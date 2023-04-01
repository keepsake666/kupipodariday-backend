import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;
  @IsString()
  @Length(2, 200)
  @IsOptional()
  about: string;
  @IsString()
  @IsUrl()
  @IsOptional()
  avatar: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
