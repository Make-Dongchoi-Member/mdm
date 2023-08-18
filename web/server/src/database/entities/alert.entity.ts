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
export class AlertEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ nullable: true })
  roomId: number;

  @Column('enum', { enum: AlertType })
  type: AlertType;

  @ManyToOne(() => Users, (user) => user.sendAlerts, {
    cascade: true,
    eager: true,
  })
  sender: Users;

  @ManyToOne(() => Users, (user) => user.receiveAlerts, {
    cascade: true,
    eager: true,
  })
  receiver: Users;
}
