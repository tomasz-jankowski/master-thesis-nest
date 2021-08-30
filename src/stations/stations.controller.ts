import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { StationsService } from './stations.service';
import { UpdateStationDto } from './dto/update-station.dto';
import { PatchStationDto } from './dto/patch-station.dto';
import { CreateStationDto } from './dto/create-station.dto';

@Controller('api/stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get()
  async findAll() {
    return this.stationsService.findAll();
  }

  @Post()
  async create(@Body() createStationDto: CreateStationDto) {
    return await this.stationsService.create(createStationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stationsService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateStationDto: UpdateStationDto) {
    return await this.stationsService.update(+id, updateStationDto);
  }

  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body() patchStationDto: PatchStationDto,
  ) {
    return await this.stationsService.patch(+id, patchStationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.stationsService.remove(+id);
  }
}
