import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private userRepository: Repository<Offer>,
  ) {}
  create(createOfferDto: CreateOfferDto) {
    return this.userRepository.save(createOfferDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return this.userRepository.update(id, updateOfferDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
