import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Rooms } from './room.entity';

@Entity()
export class MessageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: string;

  @Column()
  body: string;

  @Column()
  isDM: boolean;

  @Column()
  date: Date;

  @ManyToOne(() => Users, (user) => user.message, {
    cascade: true,
    eager: true,
  })
  sender: Users;

  @ManyToOne(() => Rooms, (room) => room.messages, {
    cascade: true,
    eager: true,
  })
  room: Rooms;
}
