import { TimeStampedEntity } from '../common/entities/time-stamped.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Measurement } from '../measurements/measurement.entity';

@Entity()
export class Station extends TimeStampedEntity {
  @Column({ unique: true })
  number: number;

  @Column({ nullable: true })
  uniqueName: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isRegistered: boolean;

  @OneToMany((type) => Measurement, (measurement) => measurement.station, {
    eager: false,
  })
  measurements: Measurement[];
}
