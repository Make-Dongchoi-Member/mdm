import {
  BaseEntity,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { DirectMessageEntity } from './dm-message.entity';

@Entity()
export class DMRooms extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Users, (user) => user.dmRooms, {
    eager: true,
    cascade: true,
  })
  users: Users[];

  @OneToMany(() => DirectMessageEntity, (dm) => dm.room)
  messages: DirectMessageEntity[];
}
