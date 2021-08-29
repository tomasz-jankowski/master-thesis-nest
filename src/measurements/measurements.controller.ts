import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { Public } from '../common/decorators/public.decorator';
import { MeasurementsFilterDto } from './dto/measurements-filter.dto';

@Controller('api/measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Public()
  @Post()
  async create(@Body() data, @Req() req) {
    return await this.measurementsService.create(data, req);
  }

  @Get()
  async findAll() {
    return await this.measurementsService.findAll();
  }

  @Post('filter')
  findFiltered(@Body() filterDto: MeasurementsFilterDto) {
    return this.measurementsService.findFiltered(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.measurementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeasurementDto: UpdateMeasurementDto,
  ) {
    return this.measurementsService.update(+id, updateMeasurementDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.measurementsService.remove(+id);
  }
}
