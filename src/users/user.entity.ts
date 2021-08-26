import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { TimeStampedEntity } from '../common/entities/time-stamped.entity';
import { Exclude } from 'class-transformer';
import { hash } from 'bcrypt';
import { Matches, MinLength, NotEquals } from 'class-validator';

@Entity()
export class User extends TimeStampedEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  @NotEquals('root')
  login: string;

  @Column()
  @Exclude()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }
}
