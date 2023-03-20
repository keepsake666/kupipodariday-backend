import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';
import { IsNumber, IsUrl, Length } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @Length(1, 250)
  name?: string;
  @IsUrl()
  link?: string;
  @IsUrl()
  image?: string;
  @IsNumber()
  price?: number;
  @IsNumber()
  raised?: number;
  @Length(1, 1024)
  description?: string;
}
