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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req, @Body() createWishDto: CreateWishDto) {
    const userId = await req.user.id;
    return this.wishesService.create(createWishDto, userId);
  }
  @Get('last')
  getLastWishes() {
    return this.wishesService.getLastWishes();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.getTopWishes();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req) {
    const idUser = await req.user.id;
    return this.wishesService.findOne(id, idUser);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    const idUser = await req.user.id;
    return this.wishesService.update(id, updateWishDto, idUser);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    const idUser = await req.user.id;
    return this.wishesService.remove(id, idUser);
  }
  @Post(':id/copy')
  @UseGuards(JwtGuard)
  copy(@Param('id') id: number, @Req() req) {
    return this.wishesService.copyWish(id, req.user.id);
  }
}
