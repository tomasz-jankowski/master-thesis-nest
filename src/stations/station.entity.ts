import { TimeStampedEntity } from '../common/entities/time-stamped.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Measurement } from '../measurements/measurement.entity';

@Entity()
export class Station extends TimeStampedEntity {
  // Number stacji pomiarowej
  @Column({ unique: true })
  number: number;

  // Unikalna nazwa stacji pomiarowej (opcjonalna: "nullable: true")
  @Column({ nullable: true })
  uniqueName: string;

  // Czy stacja pomiarowa jest aktualnie aktywna (tj. używana) - parametr zmieniany przez użytkownika
  @Column({ default: false })
  isActive: boolean;

  // Czy stacja pomiarowa jest zarejestowana - parametr zmieniany przez użytkownika (jeżeli jest niezarejestrowana, to nie jest uwzględniana na mapie zanieczyszczeń)
  @Column({ default: false })
  isRegistered: boolean;

  // Pomiary (relacja "jedna stacja pomiarowa -> wiele pomiarów")
  @OneToMany((type) => Measurement, (measurement) => measurement.station, {
    // Parametr określający zachowanie domyślne przy uzyskiwaniu rekordów z bazy danych - "false" oznacza, że relacje nie mają być automatycznie zwracane (tj. przy pozyskiwaniu danych pomiarowych z bazy danych nie zostaną zwrócone stacje pomiarowe, do których dane pomiarhy należą
    eager: false
  })
  measurements: Measurement[];
}
