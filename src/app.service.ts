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

  async getStation(id: number) {
    return await this.stationsService.findOne(id);
  }

  async getSeries(id: number, query: string) {
    return await this.measurementsService.getSeries(id, query);
  }

  async getMeasurements() {
    return await this.measurementsService.findRegistered();
  }

  async getMeasurement(id: number) {
    return await this.measurementsService.findOne(id);
  }

  async getUsers() {
    return await this.usersService.findAll();
  }

  async getUser(id: number) {
    return await this.usersService.findById(id);
  }

  async upload(data: string) {
    return await this.measurementsService.create(data);
  }
}
