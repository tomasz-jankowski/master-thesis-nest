import { BeforeInsert, Column, Entity } from 'typeorm';
import { TimeStampedEntity } from '../common/entities/time-stamped.entity';
import { Exclude } from 'class-transformer';
import { hash } from 'bcrypt';
import { Matches, MinLength, NotEquals } from 'class-validator';

@Entity()
export class User extends TimeStampedEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  // Pole nie może przyjąć wartości "root" - jest to związane z "tylnym wejściem" do strony internetowej
  @NotEquals('root')
  login: string;

  @Column()
  // Nie zwracaj tego pola przy uzyskiwaniu rekordów z bazy danych
  @Exclude()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  // Funkcja wywoływana przed wstawieniem nowego rekordu do bazy danych - szyfrowanie hasła
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }
}
