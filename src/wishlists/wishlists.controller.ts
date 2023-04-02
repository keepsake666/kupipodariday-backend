import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../auth/jwt-auth.guard';

@Controller('wishlists')
@UseGuards(JwtGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    const idUser = await req.user.id;
    return this.wishlistsService.create(createWishlistDto, idUser);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: number,
  //   @Body() updateWishlistDto: UpdateWishlistDto,
  // ) {
  //   return this.wishlistsService.update(id, updateWishlistDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.wishlistsService.remove(id);
  }
}
