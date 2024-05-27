import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
