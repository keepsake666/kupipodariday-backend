import { IsNumber, IsString, IsUrl, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;
  @IsString()
  @IsUrl()
  link: string;
  @IsString()
  @IsUrl()
  image: string;
  @IsNumber()
  price: number;
  @IsString()
  @Length(1, 1024)
  description: string;
  owner: User;
}
