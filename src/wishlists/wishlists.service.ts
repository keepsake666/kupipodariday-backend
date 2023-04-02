import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, idUser: number) {
    const user = await this.userRepository.findOne({ where: { id: idUser } });
    const items = createWishlistDto.itemsId.map((item) => ({
      id: item,
    }));
    const wishes = await this.wishRepository.find({ where: items });
    const wishlist = await this.wishlistRepository.save({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
    return wishlist;
  }

  findAll() {
    return this.wishlistRepository.find({
      relations: { owner: true, items: true },
    });
  }

  findOne(id: number) {
    return this.wishlistRepository.findOne({
      relations: {
        items: true,
        owner: true,
      },
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    idUser: number,
  ) {
    const wishList = await this.wishlistRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id,
        owner: {
          id: idUser,
        },
      },
    });
    if (!wishList)
      throw new BadRequestException('Чужая подборка или такой подборки нет');

    for (const key in updateWishlistDto) {
      if (key === 'itemsId') {
        const items = updateWishlistDto[key].map((item) => ({
          id: item,
        }));
        const wishes = await this.wishRepository.find({
          where: items,
        });
        wishList.items = wishes;
      } else {
        wishList[key] = updateWishlistDto[key];
      }
    }

    return this.wishlistRepository.save(wishList);
  }

  async remove(id: number, idUser: number) {
    const wishList = await this.wishlistRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id,
        owner: {
          id: idUser,
        },
      },
    });
    if (!wishList)
      throw new BadRequestException('Чужая подарка или такой подарки нет');
    if (wishList) await this.wishlistRepository.remove(wishList);
  }
}
