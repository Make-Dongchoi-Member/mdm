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
import { MessageEntity } from './message.entity';
import { DMRooms } from './dm-room.entity';

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

  @Column({ default: 'offline' })
  status: string;

  @Column({ nullable: true })
  socket: string | null;

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
  record: GameHistory[];

  @OneToMany(() => GameHistory, (history) => history.enemy)
  recordForEnemy: GameHistory[];

  @OneToMany(() => MessageEntity, (message) => message.sender)
  message: MessageEntity[];

  @ManyToMany(() => DMRooms, (dmRooms) => dmRooms.users)
  @JoinTable()
  dmRooms: DMRooms[];
}
