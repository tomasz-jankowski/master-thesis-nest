import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import * as rawbody from 'raw-body';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from './measurement.entity';
import { Repository } from 'typeorm';
import { StationsService } from '../stations/stations.service';

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
      for (let i = 0; i < values.length; i++) dataToSave[keys[i]] = values[i];
      dataToSave['date'] = new Date(
        dataToSave['date'].replace(
          /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
          '$4:$5:$6 $2/$3/$1',
        ),
      );
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

  async findOne(id: number) {
    return await this.measurementsRepository.findOne(id);
  }

  update(id: number, updateMeasurementDto: UpdateMeasurementDto) {
    return `This action updates a #${id} measurement`;
  }

  remove(id: number) {
    return `This action removes a #${id} measurement`;
  }
}
