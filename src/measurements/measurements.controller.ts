import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('api/measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Public()
  @Post()
  async create(@Body() data, @Req() req) {
    return await this.measurementsService.create(data, req);
  }

  @Get()
  findAll() {
    return this.measurementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.measurementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeasurementDto: UpdateMeasurementDto) {
    return this.measurementsService.update(+id, updateMeasurementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.measurementsService.remove(+id);
  }
}
