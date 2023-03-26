import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private userRepository: Repository<Wish>,
  ) {}
  async create(createWishDto: CreateWishDto) {
    const wish = await this.userRepository.save(createWishDto);
    return wish;
  }

  findAll() {
    return this.userRepository.find({ relations: { owner: true } });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return this.userRepository.update(id, updateWishDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
