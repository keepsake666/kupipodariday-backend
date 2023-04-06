import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createWishDto: CreateWishDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    await this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
    return {
      message: 'Подарок создан',
    };
  }

  async findOne(id: number, idUser) {
    const wish = await this.wishRepository.findOne({
      where: {
        id,
      },
      relations: { owner: true, offers: { user: true } },
      select: { offers: { id: true, amount: true, user: { username: true } } },
    });
    if (!wish) {
      throw new BadRequestException('Такого подарка нет');
    }
    if (wish.owner.id === idUser) {
      return wish;
    }
    if (wish.owner.id !== idUser) {
      return {
        description: wish.description,
        offers: wish.offers,
      };
    }
  }

  async update(id: number, updateWishDto: UpdateWishDto, idUser) {
    const wish = await this.wishRepository.findOne({
      relations: {
        offers: true,
        owner: true,
      },
      where: {
        id,
        owner: {
          id: idUser,
        },
      },
    });
    if (!wish)
      throw new BadRequestException('Чужой подарок или такого подарка нет');

    if (wish) await this.wishRepository.update(id, updateWishDto);
    await this.wishRepository.findOne({
      where: {
        id,
      },
    });
    return {
      message: 'Подарок обновлен',
    };
  }

  async remove(id: number, idUser: number) {
    const wish = await this.wishRepository.findOne({
      where: {
        id,
        owner: {
          id: idUser,
        },
      },
      relations: {
        owner: true,
      },
    });
    if (!wish)
      throw new BadRequestException('Чужой подарок или такого подарка нет');
    try {
      return await this.wishRepository.remove(wish);
    } catch (err) {
      throw new ConflictException('На подарок уже скинулись');
    }
  }

  async copyWish(id: number, idUser) {
    const wish = await this.wishRepository.findOne({ where: { id } });
    if (!wish) throw new BadRequestException('Такого подарка нет');
    const user = await this.userRepository.findOne({
      where: { id: idUser },
      relations: { wishes: true },
    });
    const wishHas = user.wishes.some((item) => item.id === wish.id);
    if (!wishHas) {
      const newWish = this.wishRepository.create(wish);
      newWish.owner = user;
      wish.copied += 1;
      await this.wishRepository.save(wish);
      await this.wishRepository.insert(newWish);
    }
    return { message: 'Подарок скопирован' };
  }

  getLastWishes() {
    return this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      skip: 0,
      take: 40,
    });
  }

  getTopWishes() {
    return this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      skip: 0,
      take: 20,
    });
  }
}
