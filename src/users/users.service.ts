import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { optionalRequire } from '@nestjs/core/helpers/optional-require';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(userDto: CreateUserDto) {
    const newUser = await this.findByUsername(userDto.username);

    if (newUser) {
      throw new HttpException(
        'Пользователь с таким именем уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const passwordHash = await bcrypt.hash(userDto.password, 5);
    const user = await this.userRepository.create({
      ...userDto,
      password: passwordHash,
    });

    return this.userRepository.save(user);
  }
  async findByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });

    return user;
  }
  async findMany(query: string) {
    const user = await this.userRepository.findOne({
      where: [{ username: query }, { email: query }],
    });
    if (!user) {
      throw new HttpException(
        'Такого пользователя нет',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { ...user, password: undefined };
  }
  async findAll() {
    const users = await this.userRepository.find({
      select: { id: true, username: true, about: true },
      relations: { wishes: true },
    });

    return users;
  }

  async findMe(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return { ...user, password: undefined };
  }
  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return {
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const passwordHash = await bcrypt.hash(updateUserDto.password, 5);
      await this.userRepository.update(id, {
        ...updateUserDto,
        password: passwordHash,
      });
      const user = await this.userRepository.findOneBy({ id });
      return { ...user, password: undefined };
    }
    await this.userRepository.update(id, updateUserDto);
    const user = await this.userRepository.findOneBy({ id });
    return { ...user, password: undefined };
  }
  async findMyWishes(id) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { wishes: true },
    });
    return user.wishes;
  }

  async findUserWishes(value: string) {
    const user = await this.userRepository.findOne({
      where: [{ username: value }, { email: value }],
      relations: { wishes: true },
    });
    if (!user) {
      throw new HttpException(
        'Такого пользователя нет',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.wishes;
  }
}
