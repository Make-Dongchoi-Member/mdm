import { RoomType } from 'src/types/enums';
import { chatting } from 'src/types/interfaces';
import { BaseEntity, Column, PrimaryColumn } from 'typeorm';

export class Rooms extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  roomtype: RoomType;

  @Column()
  memberCount: number;

  @Column()
  users: number[];

  @Column()
  chattings: chatting[];
}
