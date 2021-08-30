import { Injectable } from '@nestjs/common';
import { UpdateStationDto } from './dto/update-station.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Station } from './station.entity';
import { Repository } from 'typeorm';
import { PatchStationDto } from './dto/patch-station.dto';
import { CreateStationDto } from './dto/create-station.dto';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationsRepository: Repository<Station>,
  ) {}

  async createWithNumber(number: number) {
    return await this.stationsRepository.save({ number });
  }

  async findAll() {
    return await this.stationsRepository.find({ relations: ['measurements'] });
  }

  async create(createStationDto: CreateStationDto) {
    if (createStationDto['isActive'])
      createStationDto['isActive'] = createStationDto['isActive'] === 'true';
    return await this.stationsRepository.save({
      isRegistered: true,
      ...createStationDto,
    });
  }

  async findOne(id: number) {
    return await this.stationsRepository.findOne(id, {
      relations: ['measurements'],
    });
  }

  async findByNumber(number: number) {
    return await this.stationsRepository
      .createQueryBuilder('station')
      .where('station.number = :number', { number })
      .getOne();
  }

  async update(id: number, updateStationDto: UpdateStationDto) {
    updateStationDto['isActive'] = updateStationDto['isActive'] === 'true';
    updateStationDto['isRegistered'] =
      updateStationDto['isRegistered'] === 'true';
    return await this.stationsRepository.update(id, updateStationDto);
  }

  async patch(id: number, patchStationDto: PatchStationDto) {
    if (patchStationDto['isActive'])
      patchStationDto['isActive'] = patchStationDto['isActive'] === 'true';
    if (patchStationDto['isRegistered'])
      patchStationDto['isRegistered'] =
        patchStationDto['isRegistered'] === 'true';
    return await this.stationsRepository.update(id, patchStationDto);
  }

  async remove(id: number) {
    return await this.stationsRepository.delete(id);
  }

  async findOrCreate(number: string) {
    const station = await this.findByNumber(+number);
    if (station) return station;
    else return await this.createWithNumber(+number);
  }
}
