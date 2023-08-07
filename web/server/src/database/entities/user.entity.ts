import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { GameHistory } from './game-history.entity';

@Entity()
export class Users extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ nullable: true })
  nickName: string | null;

  @Column()
  email: string | null;

  @Column({ nullable: true })
  status: string | null;

  @Column({ nullable: true })
  avatar: string | null;

  @Column({ nullable: true })
  skin: number | null;

  @Column('int', { array: true, default: [] })
  rooms: number[];

  @Column('int', { array: true, default: [] })
  friends: number[];

  @Column('int', { array: true, default: [] })
  blocks: number[];

  @OneToMany(() => GameHistory, (history) => history.user)
  histories: GameHistory[];
}
