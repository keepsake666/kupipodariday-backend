import { Injectable } from '@nestjs/common';
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
    const wishlist = await this.wishlistRepository.save(createWishlistDto);
    const user = await this.userRepository.findOne({ where: { id: idUser } });
    const items = createWishlistDto.itemsId.map((item) => ({
      id: item,
    }));
    const wishes = await this.wishRepository.find({ where: items });
    wishlist.owner = user;
    wishlist.items = wishes;
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

  // update(id: number, updateWishlistDto: UpdateWishlistDto) {
  //   return this.userRepository.update(id, updateWishlistDto);
  // }

  remove(id: number) {
    return this.wishlistRepository.delete(id);
  }
}
