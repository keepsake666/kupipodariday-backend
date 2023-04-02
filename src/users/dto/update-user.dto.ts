import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(2, 30)
  @IsOptional()
  username?: string;

  @IsString()
  @Length(2, 200)
  @IsOptional()
  about?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsOptional()
  password?: string;
}
