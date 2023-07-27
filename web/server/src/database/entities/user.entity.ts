import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

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
}
