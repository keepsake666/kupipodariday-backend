import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsDate,
  IsEmail,
  IsInt,
  IsNumber,
  IsUrl,
  Length,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsNumber()
  price: number;

  @Column()
  @IsNumber()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @IsEmail()
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column('text', { array: true })
  offers: string[];

  @Column()
  @IsInt()
  copied: number;
}
