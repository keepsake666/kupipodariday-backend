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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('find')
  findMany(@Body() createUserDto: CreateUserDto) {
    return this.usersService.findMany(
      createUserDto.username || createUserDto.email,
    );
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

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
