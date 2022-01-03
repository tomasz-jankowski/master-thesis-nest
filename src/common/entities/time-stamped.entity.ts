import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export abstract class TimeStampedEntity extends BaseEntity {
  // Klucz główny bazy danych
  @PrimaryGeneratedColumn()
  id: number;

  // Automatycznie aktualizująca się data przy wszelkich zmianach w rekordzie w bazie danych
  @UpdateDateColumn()
  updatedAt: Date;

  // Data utworzenia rekordu w bazie danych
  @CreateDateColumn()
  createdAt: Date;
}
