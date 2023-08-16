import { AlertType } from 'src/types/enums';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class AlarmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column('enum', { enum: AlertType })
  type: AlertType;

  @ManyToOne(() => Users, (user) => user.sendAlarms, {
    cascade: true,
    eager: true,
  })
  sender: Users;

  @ManyToOne(() => Users, (user) => user.receiveAlarms, {
    cascade: true,
    eager: true,
  })
  receiver: Users;
}
