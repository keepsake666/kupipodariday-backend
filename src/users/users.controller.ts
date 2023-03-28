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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get(':username')
  findMany(@Param('username') username: string) {
    return this.usersService.findMany(username);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async profile(@Req() req) {
    const user = await req.user;
    return {
      id: user.id,
      username: user.username,
      about: user.about,
      email: user.email,
    };
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = await req.user.id;
    await this.usersService.update(userId, updateUserDto);
    return {
      message: 'Пользователь изменен',
    };
  }
  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async myWishes(@Req() req) {
    const userId = await req.user.id;
    return this.usersService.findMyWishes(userId);
  }
  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }
}
