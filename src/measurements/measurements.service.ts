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

    const [stationNumber, uniqueId] = Object.keys(data)[0].split(',');
    const values = (Object.values(data)[0] as string).split(',');
    const dataToSave = {};

    if (keys.length === values.length) {
      dataToSave['station'] = await this.stationsService.findOrCreate(
        stationNumber,
      );

      for (let i = 0; i < values.length; i++) dataToSave[keys[i]] = values[i];

      dataToSave['date'] = new Date(
        moment(dataToSave['date'], 'YYYYMMDDHHmmss', true).toISOString(),
      );

      dataToSave['pump'] = dataToSave['pump'] === 't';
      dataToSave['series'] = Number(uniqueId.slice(0, 2));
      dataToSave['number'] = Number(uniqueId.slice(2));
      dataToSave['batteryVoltage'] = Number(dataToSave['batteryVoltage']) / 10;
      dataToSave['temperature'] = Number(dataToSave['temperature']) / 10;
      dataToSave['humidity'] = Number(dataToSave['humidity']) / 10;

      const measurement = await this.findByProps(
        Number(stationNumber),
        dataToSave['series'],
        dataToSave['number'],
        dataToSave['date'],
      );

      if (!measurement)
        return await this.measurementsRepository.save(dataToSave);
    }
    throw new InternalServerErrorException();
  }

  async findAll() {
    return await this.measurementsRepository.find({ relations: ['station'] });
  }

  async getSeries(id: number, query: string) {
    let [series, date] = query['series'].replace(/[\(\)]/g, '').split(' ');
    date = moment(date, 'DD.MM.YYYY', true).format('YYYY-MM-DD');
    const data = await this.measurementsRepository
      .createQueryBuilder('measurement')
      .leftJoinAndSelect('measurement.station', 'station')
      .where('station.id = :id', { id })
      .andWhere('measurement.series = :series', { series })
      .andWhere('measurement.date like :date', { date: `${date}%` })
      .getMany();
    return data;
  }

  async findRegistered() {
    return await this.measurementsRepository
      .createQueryBuilder('measurement')
      .leftJoinAndSelect('measurement.station', 'station')
      .where('station.isRegistered = true')
      .getMany();
  }

  async findOne(id: number) {
    return await this.measurementsRepository.findOne(id);
  }

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

  async update(id: number, updateMeasurementDto: UpdateMeasurementDto) {
    updateMeasurementDto['date'] = moment(
      updateMeasurementDto['date'],
      'DD.MM.YYYY, HH:mm:ss',
      true,
    ).toISOString();
    updateMeasurementDto['pump'] = updateMeasurementDto['pump'] === 'true';
    console.log(updateMeasurementDto);
    return await this.measurementsRepository.update(id, updateMeasurementDto);
  }

  async remove(id: number) {
    return await this.measurementsRepository.delete(id);
  }
}
