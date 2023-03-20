import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(2, 30)
  username?: string;
  @IsString()
  @Length(2, 200)
  about?: string;
  @IsString()
  @IsUrl()
  avatar?: string;
  @IsEmail()
  email?: string;
  @IsNotEmpty()
  password?: string;
}
