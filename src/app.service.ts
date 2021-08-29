import { Injectable } from '@nestjs/common';
import { StationsService } from './stations/stations.service';
import { MeasurementsService } from './measurements/measurements.service';
import { UsersService } from './users/users.service';
import { MeasurementsFilterDto } from './measurements/dto/measurements-filter.dto';

@Injectable()
export class AppService {
  constructor(
    private stationsService: StationsService,
    private measurementsService: MeasurementsService,
    private usersService: UsersService,
  ) {}

  async getStations() {
    return await this.stationsService.findAll();
  }

  async getMeasurements(filterDto?: MeasurementsFilterDto) {
    if (filterDto && Object.keys(filterDto).length > 0)
      return await this.measurementsService.findFiltered(filterDto);
    else return await this.measurementsService.findAll();
  }

  async getUsers() {
    return await this.usersService.findAll();
  }

  async getMeasurement(id: number) {
    return await this.measurementsService.findOne(id);
  }
}
