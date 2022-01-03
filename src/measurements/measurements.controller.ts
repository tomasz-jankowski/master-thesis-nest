import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req, Put
} from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('api/measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  // Węzęł końcowy (endpoint) ustawiony jako publiczny, żeby pomiary mogły spływać ze stacji bez uwierzytelniania do serwera (uwierzytelnienie niemożliwe do zrealizowanie na modułach GSM)
  @Public()
  @Post()
  async create(@Body() data, @Req() req?) {
    return await this.measurementsService.create(data, req);
  }

  @Get()
  async findAll() {
    return await this.measurementsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.measurementsService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeasurementDto: UpdateMeasurementDto,
  ) {
    return await this.measurementsService.update(+id, updateMeasurementDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.measurementsService.remove(+id);
  }
}
