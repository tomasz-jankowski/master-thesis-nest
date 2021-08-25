import { Column, Entity } from 'typeorm';
import { TimeStampedEntity } from '../common/entities/time-stamped.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends TimeStampedEntity {
  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;
}
