import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsNumber, IsUrl } from 'class-validator';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @Column()
  @IsUrl()
  item: string;

  @Column()
  @IsNumber()
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
