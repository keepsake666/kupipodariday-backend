import { IsArray, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 1500)
  description: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
