import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class GameHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  enemy: number;

  @Column()
  win: boolean;

  @Column()
  date: Date;

  @ManyToOne(() => Users, (user) => user.histories)
  user: Users;
}
