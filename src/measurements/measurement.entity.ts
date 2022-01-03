import { Column, Entity, ManyToOne } from 'typeorm';
import { TimeStampedEntity } from '../common/entities/time-stamped.entity';
import { Station } from '../stations/station.entity';

@Entity()
export class Measurement extends TimeStampedEntity {
  // Seria pomiarowa
  @Column()
  series: number;

  // Numer pomiaru w serii
  @Column()
  number: number;

  // Data pomiaru
  @Column()
  date: Date;

  // Szerokość geograficzna
  @Column({ type: 'double' })
  latitude: number;

  // Długość geograficzna
  @Column({ type: 'double' })
  longitude: number;

  // Wysokość bezwzględna
  @Column({ type: 'double' })
  altitude: number;

  // Napięcie baterii
  @Column({ type: 'float' })
  batteryVoltage: number;

  // Stan załączanie pompy
  @Column()
  pump: boolean;

  // Pomiar PM1
  @Column()
  pm1: number;

  // Pomiar PM2.5
  @Column()
  pm25: number;

  // Pomiar PM10
  @Column()
  pm10: number;

  // Liczba dziesiątek cząsteczek o średnicy powyżej 0.3um/0.1l powietrza
  @Column()
  quantity03: number;

  // Liczba dziesiątek cząsteczek o średnicy powyżej 0.5um/0.1l powietrza
  @Column()
  quantity05: number;

  // Liczba dziesiątek cząsteczek o średnicy powyżej 1um/0.1l powietrza
  @Column()
  quantity1: number;

  // Liczba dziesiątek cząsteczek o średnicy powyżej 2.5um/0.1l powietrza
  @Column()
  quantity25: number;

  // Liczba dziesiątek cząsteczek o średnicy powyżej 5um/0.1l powietrza
  @Column()
  quantity5: number;

  // Liczba dziesiątek cząsteczek o średnicy powyżej 10um/0.1l powietrza
  @Column()
  quantity10: number;

  // Stężenie HCHO
  @Column()
  hcho: number;

  // Temperatura ( 00.0 *C )
  @Column({ type: 'float' })
  temperature: number;

  // Wilgotność ( 00.0 % )
  @Column({ type: 'float' })
  humidity: number;

  // Liczba cząsteczek CO2 podawana w zakresie 400-60000 ppm
  @Column()
  quantityCO2: number;

  // Liczba cząsteczek TVOC podawana w zakresie 0-60000 ppb
  @Column()
  quantityTVOC: number;

  // Stacja pomiarowa (relacja "wiele pomiarów -> jedna stacja pomiarowa")
  @ManyToOne((type) => Station, (station) => station.measurements, {
    // Usuwanie kaskadowe, tj. przy usunięciu stacji pomiarowej usuwane są wszystkie należące do niej pomiary
    onDelete: 'CASCADE',
  })
  station: Station;
}
