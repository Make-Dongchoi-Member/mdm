import { RoomType } from 'src/types/enums';
import { Message } from 'src/types/interfaces';
import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class Rooms extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  password: string | null;

  @Column()
  roomtype: RoomType;

  @Column({ default: 1 })
  memberCount: number;

  @Column()
  host: number;

  @Column({ default: Array<number>() })
  admin: number[];

  @Column({ default: Array<number>() })
  members: number[];

  @Column({ default: Array<number>() })
  ban: number[];

  @Column({ default: Array<number>() })
  mute: number[];

  @Column({ default: Array<Message>() })
  messages: Message[];
}
