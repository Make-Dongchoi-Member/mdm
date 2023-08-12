import { RoomType } from 'src/types/enums';
import { Message } from 'src/types/interfaces';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity()
export class Rooms extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  password: string | null;

  @Column('enum', { enum: RoomType })
  roomtype: RoomType;

  @Column({ default: 1 })
  memberCount: number;

  @Column()
  host: number;

  @Column('int', { array: true, default: [] })
  admin: number[];

  @Column('int', { array: true, default: [] })
  members: number[];

  @Column('int', { array: true, default: [] })
  ban: number[];

  @Column('int', { array: true, default: [] })
  mute: number[];

  @OneToMany(() => MessageEntity, (message) => message.room)
  messages: MessageEntity[];
}
