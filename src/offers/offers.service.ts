import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}
  async create(createOfferDto: CreateOfferDto, idUser: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: createOfferDto.itemId },
    });
    if (!wish) throw new BadRequestException('Такого подарка нет');
    const user = await this.userRepository.findOne({
      where: { id: idUser },
    });
    const offer = await this.offersRepository.save(createOfferDto);
    //проверка на свой подарок
    const userWish = user.wishes.some((item) => item.id === wish.id);
    if (!userWish) {
      offer.user = user;
      offer.item = wish;
      wish.raised = Number(wish.raised) + createOfferDto.amount;
      if (wish.raised > wish.price)
        throw new BadRequestException('Сумма больше необходимой');
      await this.wishRepository.save(wish);
      return this.offersRepository.save(offer);
    }
    throw new BadRequestException('На свой подарок скинуться невозможно');
  }

  findAll() {
    return this.offersRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  findOne(id: number) {
    return this.offersRepository.findOne({
      where: { id },
      relations: { user: true, item: true },
    });
  }
}
