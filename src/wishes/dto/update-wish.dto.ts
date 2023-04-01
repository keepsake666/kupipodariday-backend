import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';
import { IsNumber, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @Length(1, 250)
  @IsOptional()
  name?: string;
  @IsOptional()
  @IsUrl()
  link?: string;
  @IsOptional()
  @IsUrl()
  image?: string;
  @IsOptional()
  @IsNumber()
  price?: number;
  @IsOptional()
  @Length(1, 1024)
  description?: string;
}
