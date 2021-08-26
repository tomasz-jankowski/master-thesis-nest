import { Injectable } from '@nestjs/common';
import { StationsService } from './stations/stations.service';
import { MeasurementsService } from './measurements/measurements.service';
import { UsersService } from './users/users.service';

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

  async getMeasurements() {
    return await this.measurementsService.findAll();
  }

  async getUsers() {
    return await this.usersService.findAll();
  }
}
