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
  win: boolean;

  @Column()
  date: Date;

  @ManyToOne(() => Users, (user) => user.record, { cascade: true, eager: true })
  user: Users;

  @ManyToOne(() => Users, (user) => user.recordForEnemy, {
    cascade: true,
    eager: true,
  })
  enemy: Users;
}
