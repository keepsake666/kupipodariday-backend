import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
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
    return await this.userRepository.findOne({
      where: { username },
      select: {
        password: true,
        email: true,
        id: true,
        username: true,
        about: true,
        avatar: true,
      },
    });
  }
  async findMany(query: string) {
    const user = await this.userRepository.findOne({
      where: [{ username: query }, { email: query }],
      select: {
        id: true,
        avatar: true,
        username: true,
        about: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new HttpException(
        'Такого пользователя нет',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async findMe(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const passwordHash = await bcrypt.hash(updateUserDto.password, 5);
      await this.userRepository.update(id, {
        ...updateUserDto,
        password: passwordHash,
      });
      return await this.userRepository.findOneBy({ id });
    }
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOne({
      where: { id },
      select: {
        username: true,
        about: true,
        avatar: true,
        email: true,
      },
    });
  }

  async findMyWishes(id) {
    return await this.wishRepository.find({
      where: { owner: { id: id } },
      relations: { offers: true, owner: true, wishlist: true },
    });
  }

  async findUserWishes(value: string) {
    const user = await this.userRepository.findOne({
      where: [{ username: value }, { email: value }],
    });
    if (!user) {
      throw new HttpException(
        'Такого пользователя нет',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.wishRepository.find({
      where: { owner: [{ username: value }, { email: value }] },
      relations: { offers: true, owner: true, wishlist: true },
    });
  }
  async findUserName(username: string) {
    return await this.userRepository.findOneBy({ username });
  }
}
