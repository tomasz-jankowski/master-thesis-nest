import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasurementsModule } from './measurements/measurements.module';
import { StationsModule } from './stations/stations.module';
import TypeOrmConfig from './common/config/typeorm.config';
import { Measurement } from './measurements/measurement.entity';
import { Station } from './stations/station.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...TypeOrmConfig,
      entities: [Measurement, Station],
    }),
    MeasurementsModule,
    StationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
