import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import * as rawbody from 'raw-body';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from './measurement.entity';
import { Repository } from 'typeorm';
import { StationsService } from '../stations/stations.service';
import * as moment from 'moment';

@Injectable()
export class MeasurementsService {
  constructor(
    @InjectRepository(Measurement)
    private measurementsRepository: Repository<Measurement>,
    private stationsService: StationsService,
  ) {}

  async create(data, req?) {
    // Obsługa typu danych wysyłanych z modułu GSM
    if (req) {
      if (req.readable) {
        // body is not JSON, get raw body instead
        const raw = (await rawbody(req)).toString().trim();
        data = JSON.parse(raw.replace(/\\/g, ''));
      }
    } else {
      data = JSON.parse(data);
    }

    const keys = [
      'date',
      'latitude',
      'longitude',
      'altitude',
      'batteryVoltage',
      'pump',
      'pm1',
      'pm25',
      'pm10',
      'quantity03',
      'quantity05',
      'quantity1',
      'quantity25',
      'quantity5',
      'quantity10',
      'hcho',
      'temperature',
      'humidity',
      'quantityCO2',
      'quantityTVOC',
    ];

    // Format ramki danych:
    // "24,0100012": "20210827105020,52.385278,16.872205,114.6,058,n,0010,0013,0013,0170,0048,0004,0000,0000,0000,0000,0186,0617,00400,00000"

    // stationNumber: 24, uniqueId: 0100012
    const [stationNumber, uniqueId] = Object.keys(data)[0].split(',');

    // values: ["20210827105020", "52.385278", "16.872205", "114.6", "058", "n", "0010", "0013", "0013", "0170", ...]
    const values = (Object.values(data)[0] as string).split(',');
    const dataToSave = {};

    // Jeżeli liczba poszczególnych danych pomiarowych zgadza się z oczekiwaną to znajdź istniejącą lub utwórz nową stację pomiarową
    if (keys.length === values.length) {
      dataToSave['station'] = await this.stationsService.findOrCreate(
        stationNumber,
      );

      // Przypisz kolejne pary klucz-wartość do obiektu "dataToSave"
      // dla i = 4: dataToSave["batteryVoltage"] = 058
      for (let i = 0; i < values.length; i++) dataToSave[keys[i]] = values[i];

      // Utwórz nową datę w formacie ISO 8601 z formatu wysłanego przez moduł GSM
      dataToSave['date'] = new Date(
        moment(dataToSave['date'], 'YYYYMMDDHHmmss', true).toISOString(),
      );

      // Zamień wartość załączenia pompy "t"/"n" na true/false
      dataToSave['pump'] = dataToSave['pump'] === 't';

      // Ze zmiennej "uniqueId" wydziel numer serii pomiarowej (dwa pierwsze znaki) oraz numer pomiaru (od 2. znaku włącznie)
      dataToSave['series'] = Number(uniqueId.slice(0, 2));
      dataToSave['number'] = Number(uniqueId.slice(2));

      // Podziel wartość napięcia baterii, żeby uzyskać Volty
      dataToSave['batteryVoltage'] = Number(dataToSave['batteryVoltage']) / 10;

      // Analogicznie z temperaturą i wilgotnością
      dataToSave['temperature'] = Number(dataToSave['temperature']) / 10;
      dataToSave['humidity'] = Number(dataToSave['humidity']) / 10;

      // Znajdź pomiar, który ma takie same:
      //   - numer serii pomiarowej
      //   - numer pomiaru
      //   - datę pomiaru
      const measurement = await this.findByProps(
        Number(stationNumber),
        dataToSave['series'],
        dataToSave['number'],
        dataToSave['date'],
      );

      // Jeżeli nie znaleziono takiego pomiaru, to zapisz nowy pomiar do bazy danych (zabezpieczenie przed zduplikowaniem pomiarów w przypadku masowego wgrywania pomiarów z karty pamięci)
      if (!measurement)
        return await this.measurementsRepository.save(dataToSave);
    }

    // Jeżeli powyższe warunki nie zostały spełnione (zły format ramki danych / duplikacja pomiaru), to wyrzuć wyjątek (kod HTTP 500)
    throw new InternalServerErrorException();
  }

  // Znajdź wszystkie pomiary wraz z przypisanymi im stacjami pomiarowymi
  async findAll() {
    return await this.measurementsRepository.find({ relations: ['station'] });
  }

  // Uzyskaj wszystkie pomiary z danej serii pomiarowej
  async getSeries(id: number, query: string) {
    // Wydzielnie serii pomiarowej i daty pomiaru z formatu: "seria (data)"
    // np. 17 (24.01.2020)
    let [series, date] = query['series'].replace(/[\(\)]/g, '').split(' ');

    // Jeżeli dzień jest z zakresu 1-9, dodaj zero wiodące
    // np. 3.07.2020 => 03.07.2020
    if (date.split('.')[0].length === 1) date = '0' + date;

    // Przekształć datę do formatu "YYYY-MM-DD"
    date = moment(date, 'DD.MM.YYYY', true).format('YYYY-MM-DD');

    // Znajdź wszystkie pomiary z danej serii pomiarowej - kwerendy zgodne z językiem SQL
    const data = await this.measurementsRepository
      .createQueryBuilder('measurement')
      .leftJoinAndSelect('measurement.station', 'station')
      .where('station.id = :id', { id })
      .andWhere('measurement.series = :series', { series })

      // Procent na końcu pozwala na uzyskanie wszystkich danych pomiarowych dla danej daty, bez uwzględnienia czasu
      .andWhere('measurement.date like :date', { date: `${date}%` })

      .orderBy('measurement.date', 'ASC')
      .getMany();
    return data;
  }

  // Znajdź wszystkie pomiary ze stacji, które zostały zarejestrowane
  async findRegistered() {
    return await this.measurementsRepository
      .createQueryBuilder('measurement')
      .leftJoinAndSelect('measurement.station', 'station')
      .where('station.isRegistered = true')
      .getMany();
  }

  // Znajdź wszystkie dane pomiarowe dla określonego zakresu dat
  async getByDate(query?) {
    let dateEnd, dateStart;

    // Jeżeli nie podano zakresu dat: znajdź pomiary z ostatnich 24 godzin
    if (Object.keys(query).length === 0) {
      const today = new Date();
      const yesterday = moment(today).subtract(24, 'hours');

      dateEnd = today.toISOString();
      dateStart = yesterday.toISOString();
    } else {
      dateEnd = query['dateEnd'];
      dateStart = query['dateStart'];
    }

    const q = this.measurementsRepository
      .createQueryBuilder('measurement')
      .leftJoinAndSelect('measurement.station', 'station')
      .where('station.isRegistered');

    if (dateStart && dateStart !== 'undefined')
      q.andWhere('measurement.date >= :dateStart', { dateStart });
    if (dateEnd && dateEnd !== 'undefined')
      q.andWhere('measurement.date <= :dateEnd', { dateEnd });

    return await q.getMany();
  }

  // Znajdź jeden pomiar
  async findOne(id: number) {
    return await this.measurementsRepository.findOne(id);
  }

  // Znajdź jeden pomiar na podstawie:
  //   - numeru stacji pomiarowej
  //   - numeru serii pomiarowej
  //   - numeru pomiaru w serii
  //   - daty pomiaru
  async findByProps(
    stationNumber: number,
    series: number,
    number: number,
    date: Date,
  ) {
    return await this.measurementsRepository
      .createQueryBuilder('measurement')
      .leftJoinAndSelect('measurement.station', 'station')
      .where('station.number = :stationNumber', { stationNumber })
      .andWhere('measurement.series = :series', { series })
      .andWhere('measurement.number = :number', { number })
      .andWhere('measurement.date = :date', { date })
      .getOne();
  }

  // Zaktualizuj istniejący pomiar
  async update(id: number, updateMeasurementDto: UpdateMeasurementDto) {
    // Przeksztłcenie daty do formatu ISO 8601
    updateMeasurementDto['date'] = moment(
      updateMeasurementDto['date'],
      'DD.MM.YYYY, HH:mm:ss',
      true,
    ).toISOString();

    // Przekształcenie wartości "true"/"false" na true/false, tj. string => boolean
    updateMeasurementDto['pump'] = updateMeasurementDto['pump'] === 'true';
    console.log(updateMeasurementDto);
    return await this.measurementsRepository.update(id, updateMeasurementDto);
  }

  // Usuń pomiar
  async remove(id: number) {
    return await this.measurementsRepository.delete(id);
  }
}
