import { Column, Entity, ManyToOne } from 'typeorm';
import { TimeStampedEntity } from '../common/entities/time-stamped.entity';
import { Station } from '../stations/station.entity';

@Entity()
export class Measurement extends TimeStampedEntity {
  @Column()
  series: number;

  @Column()
  number: number;

  @Column()
  date: Date;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longitude: number;

  @Column({ type: 'double' })
  altitude: number;

  @Column({ type: 'float' })
  batteryVoltage: number;

  @Column()
  pump: boolean;

  @Column()
  pm1: number;

  @Column()
  pm25: number;

  @Column()
  pm10: number;

  @Column()
  quantity03: number;

  @Column()
  quantity05: number;

  @Column()
  quantity1: number;

  @Column()
  quantity25: number;

  @Column()
  quantity5: number;

  @Column()
  quantity10: number;

  @Column()
  hcho: number;

  @Column({ type: 'float' })
  temperature: number;

  @Column({ type: 'float' })
  humidity: number;

  @Column()
  quantityCO2: number;

  @Column()
  quantityTVOC: number;

  @ManyToOne((type) => Station, (station) => station.measurements, {
    onDelete: 'CASCADE',
  })
  station: Station;
}
