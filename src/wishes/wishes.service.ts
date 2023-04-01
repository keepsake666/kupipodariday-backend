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
  async create(createWishDto: CreateWishDto) {
    const wish = await this.wishRepository.save(createWishDto);
    return wish;
  }

  findAll() {
    return this.wishRepository.find({ relations: { owner: true } });
  }

  findOne(id: number) {
    return this.wishRepository.findOneBy({ id });
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
    return this.wishRepository.findOne({
      relations: {
        offers: true,
        owner: true,
      },
      where: {
        id,
      },
    });
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
      return this.wishRepository.remove(wish);
    } catch (err) {
      throw new ConflictException('На подарок уже скинулись');
    }
    return this.wishRepository.delete(id);
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
