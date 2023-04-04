import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async profile(@Req() req) {
    const userId = await req.user.id;
    return this.usersService.findMe(userId);
  }
  @UseGuards(JwtGuard)
  @Patch('me')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = await req.user.id;
    return this.usersService.update(userId, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async myWishes(@Req() req) {
    const userId = await req.user.id;
    return this.usersService.findMyWishes(userId);
  }

  @UseGuards(JwtGuard)
  @Get('find')
  findMany(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }
  @Get(':username')
  async findUserName(@Param('username') username: string) {
    return this.usersService.findUserName(username);
  }

  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }
}
