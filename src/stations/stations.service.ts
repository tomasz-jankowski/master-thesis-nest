import { Injectable } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Station } from './station.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationsRepository: Repository<Station>,
  ) {}

  async create(uniqueId: string) {
    return await this.stationsRepository.save({ uniqueId });
  }

  async findAll() {
    return await this.stationsRepository.find({ relations: ['measurements'] });
  }

  async findOne(id: number) {
    return await this.stationsRepository.findOne(id, { relations: ['measurements'] });
  }

  async findByUniqueName(uniqueId: string) {
    return await this.stationsRepository.findOne({ uniqueId });
  }

  update(id: number, updateStationDto: UpdateStationDto) {
    return `This action updates a #${id} station`;
  }

  remove(id: number) {
    return `This action removes a #${id} station`;
  }

  async findOrCreate(id: string) {
    const station = await this.findByUniqueName(id);
    if (station) return station;
    else return await this.create(id);
  }
}
