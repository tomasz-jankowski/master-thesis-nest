import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import * as rawbody from 'raw-body';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from './measurement.entity';
import { Repository } from 'typeorm';
import { StationsService } from '../stations/stations.service';
import { MeasurementsFilterDto } from './dto/measurements-filter.dto';
import * as moment from 'moment';

@Injectable()
export class MeasurementsService {
  constructor(
    @InjectRepository(Measurement)
    private measurementsRepository: Repository<Measurement>,
    private stationsService: StationsService,
  ) {}

  async create(data, req) {
    if (req.readable) {
      // body is not JSON, get raw body instead
      const raw = (await rawbody(req)).toString().trim();
      data = JSON.parse(raw.replace(/\\/g, ''));
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

    const [stationUniqueId, uniqueId] = Object.keys(data)[0].split(',');
    const values = (Object.values(data)[0] as string).split(',');
    const dataToSave = {};

    if (keys.length === values.length) {
      dataToSave['station'] = await this.stationsService.findOrCreate(
        stationUniqueId,
      );
      // for (let i = 0; i < values.length; i++) dataToSave[keys[i]] = values[i];
      // dataToSave['date'] = new Date(
      //   dataToSave['date'].replace(
      //     /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
      //     '$4:$5:$6 $2/$3/$1',
      //   ),
      // );
      dataToSave['pump'] = dataToSave['pump'] === 't';
      dataToSave['series'] = Number(uniqueId.slice(0, 2));
      dataToSave['number'] = Number(uniqueId.slice(2));
      return await this.measurementsRepository.save(dataToSave);
    } else {
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return await this.measurementsRepository.find({ relations: ['station'] });
  }

  // async findFiltered(filterDto: MeasurementsFilterDto) {
  //   const filter = Object.fromEntries(
  //     Object.entries(filterDto).filter(([_, v]) => v !== ''),
  //   );
  //   let {
  //     dateEnd,
  //     dateMultiple,
  //     dateStart,
  //     pump,
  //     maxAltitude,
  //     minAltitude,
  //     series,
  //   } = filter;
  //
  //   const {
  //     locEnd,
  //     locStart,
  //     maxBatteryVolage,
  //     maxHCHO,
  //     maxHumidity,
  //     maxPM1,
  //     maxPM10,
  //     maxPM25,
  //     maxQuantity1,
  //     maxQuantity03,
  //     maxQuantity05,
  //     maxQuantity5,
  //     maxQuantity10,
  //     maxQuantity25,
  //     maxTemperature,
  //     minBatteryVolage,
  //     minHCHO,
  //     minHumidity,
  //     minPM1,
  //     minPM10,
  //     minPM25,
  //     minQuantity1,
  //     minQuantity03,
  //     minQuantity05,
  //     minQuantity5,
  //     minQuantity10,
  //     minQuantity25,
  //     minTemperature,
  //     stationId,
  //   } = filter;
  //
  //   const query = this.measurementsRepository.createQueryBuilder('measurement');
  //   query.leftJoinAndSelect('measurement.station', 'station');
  //   query.where('');
  //
  //   if (dateEnd) {
  //     dateEnd = moment(dateEnd, 'DD.MM.YYYY hh:mm').toDate();
  //     query.andWhere('measurement.date <= :dateEnd', { dateEnd });
  //   }
  //
  //   if (dateStart) {
  //     dateStart = moment(dateStart, 'DD.MM.YYYY hh:mm').toDate();
  //     query.andWhere('measurement.date >= :dateStart', { dateStart });
  //   }
  //
  //   if (dateMultiple) {
  //     dateMultiple = dateMultiple.split(',');
  //     const dates = dateMultiple.map((date) =>
  //       moment(date, 'DD.MM.YYYY').toDate(),
  //     );
  //     query.andWhere('Date(measurement.date) IN (:...dates)', { dates });
  //   }
  //
  //   if (pump) {
  //     pump = pump === 'true';
  //     query.andWhere('measurement.pump = :pump', { pump });
  //   }
  //
  //   if (maxAltitude) {
  //     maxAltitude += 0.1;
  //     query.andWhere('measurement.altitude <= :maxAltitude', { maxAltitude });
  //   }
  //
  //   if (minAltitude) {
  //     minAltitude -= 0.1;
  //     query.andWhere('measurement.altitude >= :minAltitude', { minAltitude });
  //   }
  //
  //   if (maxBatteryVolage)
  //     query.andWhere('measurement.batteryVoltage <= :maxBatteryVolage', {
  //       maxBatteryVolage,
  //     });
  //
  //   if (minBatteryVolage)
  //     query.andWhere('measurement.batteryVoltage >= :minBatteryVolage', {
  //       minBatteryVolage,
  //     });
  //
  //   if (maxHCHO)
  //     query.andWhere('measurement.hcho <= :maxHCHO', {
  //       maxHCHO,
  //     });
  //
  //   if (minHCHO)
  //     query.andWhere('measurement.hcho >= :minHCHO', {
  //       minHCHO,
  //     });
  //
  //   if (maxHumidity)
  //     query.andWhere('measurement.humidity <= :maxHumidity', {
  //       maxHumidity,
  //     });
  //
  //   if (minHumidity)
  //     query.andWhere('measurement.humidity >= :minHumidity', {
  //       minHumidity,
  //     });
  //
  //   if (maxPM1)
  //     query.andWhere('measurement.pm1 <= :maxPM1', {
  //       maxPM1,
  //     });
  //
  //   if (minPM1)
  //     query.andWhere('measurement.pm1 >= :minPM1', {
  //       minPM1,
  //     });
  //
  //   if (maxPM10)
  //     query.andWhere('measurement.pm10 <= :maxPM10', {
  //       maxPM10,
  //     });
  //
  //   if (minPM10)
  //     query.andWhere('measurement.pm10 >= :minPM10', {
  //       minPM10,
  //     });
  //
  //   if (maxPM25)
  //     query.andWhere('measurement.pm25 <= :maxPM25', {
  //       maxPM25,
  //     });
  //
  //   if (minPM25)
  //     query.andWhere('measurement.pm25 >= :minPM25', {
  //       minPM25,
  //     });
  //
  //   if (maxQuantity1)
  //     query.andWhere('measurement.quantity1 <= :maxQuantity1', {
  //       maxQuantity1,
  //     });
  //
  //   if (minQuantity1)
  //     query.andWhere('measurement.quantity1 >= :minQuantity1', {
  //       minQuantity1,
  //     });
  //
  //   if (maxQuantity03)
  //     query.andWhere('measurement.quantity03 <= :maxQuantity03', {
  //       maxQuantity03,
  //     });
  //
  //   if (minQuantity03)
  //     query.andWhere('measurement.quantity03 >= :minQuantity03', {
  //       minQuantity03,
  //     });
  //
  //   if (maxQuantity05)
  //     query.andWhere('measurement.quantity05 <= :maxQuantity05', {
  //       maxQuantity05,
  //     });
  //
  //   if (minQuantity05)
  //     query.andWhere('measurement.quantity05 >= :minQuantity05', {
  //       minQuantity05,
  //     });
  //
  //   if (maxQuantity5)
  //     query.andWhere('measurement.quantity5 <= :maxQuantity5', {
  //       maxQuantity5,
  //     });
  //
  //   if (minQuantity5)
  //     query.andWhere('measurement.quantity5 >= :minQuantity5', {
  //       minQuantity5,
  //     });
  //
  //   if (maxQuantity10)
  //     query.andWhere('measurement.quantity10 <= :maxQuantity10', {
  //       maxQuantity10,
  //     });
  //
  //   if (minQuantity10)
  //     query.andWhere('measurement.quantity10 >= :minQuantity10', {
  //       minQuantity10,
  //     });
  //
  //   if (maxQuantity25)
  //     query.andWhere('measurement.quantity25 <= :maxQuantity25', {
  //       maxQuantity25,
  //     });
  //
  //   if (minQuantity25)
  //     query.andWhere('measurement.quantity25 >= :minQuantity25', {
  //       minQuantity25,
  //     });
  //
  //   if (maxTemperature)
  //     query.andWhere('measurement.temperature <= :maxTemperature', {
  //       maxTemperature,
  //     });
  //
  //   if (minTemperature)
  //     query.andWhere('measurement.temperature >= :minTemperature', {
  //       minTemperature,
  //     });
  //
  //   if (stationId)
  //     query.andWhere('station.id IN (:...stationId)', { stationId });
  //
  //   if (series) {
  //     series = series.split(',').map((s) => Number(s));
  //     query.andWhere('measurement.series IN (:...series)', { series });
  //   }
  //
  //   let data = await query.getMany();
  //   if (locEnd) {
  //     const [latitude, longitude] = locEnd.split(',');
  //     data = data.filter(
  //       (d) => d.latitude <= latitude && d.longitude <= longitude,
  //     );
  //   }
  //
  //   if (locStart) {
  //     const [latitude, longitude] = locStart.split(',');
  //     data = data.filter(
  //       (d) => d.latitude >= latitude && d.longitude >= longitude,
  //     );
  //   }
  //   return data;
  // }

  async findOne(id: number) {
    return await this.measurementsRepository.findOne(id);
  }

  update(id: number, updateMeasurementDto: UpdateMeasurementDto) {
    return `This action updates a #${id} measurement`;
  }

  async remove(id: number) {
    return await this.measurementsRepository.delete(id);
  }
}
