import { Type } from 'class-transformer';

export class MeasurementsFilterDto {
  @Type(() => Date.UTC)
  dateEnd: Date;

  @Type(() => Date.UTC)
  dateStart: Date;

  dateMultiple: any;
  locEnd: any;
  locStart: any;
  pump: any;
  series: any;

  @Type(() => Number)
  maxAltitude: number;

  @Type(() => Number)
  maxBatteryVolage: number;

  @Type(() => Number)
  maxHCHO: number;

  @Type(() => Number)
  maxHumidity: number;

  @Type(() => Number)
  maxPM1: number;

  @Type(() => Number)
  maxPM10: number;

  @Type(() => Number)
  maxPM25: number;

  @Type(() => Number)
  maxQuantity1: number;

  @Type(() => Number)
  maxQuantity03: number;

  @Type(() => Number)
  maxQuantity05: number;

  @Type(() => Number)
  maxQuantity5: number;

  @Type(() => Number)
  maxQuantity10: number;

  @Type(() => Number)
  maxQuantity25: number;

  @Type(() => Number)
  maxTemperature: number;

  @Type(() => Number)
  minAltitude: number;

  @Type(() => Number)
  minBatteryVolage: number;

  @Type(() => Number)
  minHCHO: number;

  @Type(() => Number)
  minHumidity: number;

  @Type(() => Number)
  minPM1: number;

  @Type(() => Number)
  minPM10: number;

  @Type(() => Number)
  minPM25: number;

  @Type(() => Number)
  minQuantity1: number;

  @Type(() => Number)
  minQuantity03: number;

  @Type(() => Number)
  minQuantity05: number;

  @Type(() => Number)
  minQuantity5: number;

  @Type(() => Number)
  minQuantity10: number;

  @Type(() => Number)
  minQuantity25: number;

  @Type(() => Number)
  minTemperature: number;

  @Type(() => Number)
  stationId: number[];
}
