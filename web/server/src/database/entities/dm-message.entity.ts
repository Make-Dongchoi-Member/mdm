import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DMRooms } from './dm-room.entity';

@Entity()
export class DirectMessageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  date: Date;

  @Column()
  sender: number;

  @Column()
  receiver: number;

  @ManyToOne(() => DMRooms, (room) => room.messages, {
    cascade: true,
    eager: true,
  })
  room: DMRooms;
}
