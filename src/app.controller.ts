import {
  Body,
  Controller,
  Get, HttpCode, HttpStatus,
  Param,
  Post,
  Query,
  Render,
  Request,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AppService } from './app.service';
import { Response } from 'express';
import { LoginGuard } from './common/guards/login.guard';
import { AuthExceptionFilter } from './common/filters/auth-exception.filter';
import { Public } from './common/decorators/public.decorator';
import { User } from './common/decorators/user.decorator';
import { User as UserEntity } from './users/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { doc } from 'prettier';
import { join } from 'path';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  // auth
  @Get()
  @Render('pages/index')
  async index(@User() user: UserEntity) {
    const stations = await this.appService.getStations();
    const measurements = await this.appService.getMeasurements();
    const users = await this.appService.getUsers();
    return {
      title: 'Strona główna',
      stations,
      measurements,
      users,
      user,
    };
  }

  @Public()
  @Get('login')
  loginPage(@Request() req, @Res() res: Response) {
    if (req.user) return res.redirect('/powietrze');
    else
      return res.render('pages/login', {
        title: 'Logowanie',
        message: req.flash('loginError'),
      });
  }

  @Public()
  // Węzęł końcowy (endpoint) służący do uwierzytelnienia
  @UseGuards(LoginGuard)
  @Post('login')
  login(@Res() res: Response) {
    res.redirect('/powietrze');
  }

  @Public()
  @Get('register')
  register(@Request() req, @Res() res: Response) {
    if (req.user) return res.redirect('/powietrze');
    else return res.render('pages/register', { title: 'Rejestracja' });
  }

  @Get('logout')
  logout(@Request() req, @Res() res: Response) {
    req.logout();
    res.redirect('/powietrze/login');
  }

  // stations
  @Get('stations')
  @Render('pages/stations/index')
  async stations(@User() user: UserEntity) {
    const stations = await this.appService.getStations();
    return { title: 'Stacje pomiarowe', stations, user };
  }

  @Get('stations/new')
  @Render('pages/stations/new')
  addStation(@User() user: UserEntity) {
    return { title: 'Dodaj stację pomiarową', user };
  }

  @Get('stations/:id')
  @Render('pages/stations/show')
  async showStation(@Param('id') id: string, @User() user: UserEntity) {
    const station = await this.appService.getStation(+id);
    return { title: `Szczegóły stacji ${station.number}`, station, user };
  }

  @Get('stations/:id/edit')
  @Render('pages/stations/edit')
  async editStation(@Param('id') id: string, @User() user: UserEntity) {
    const station = await this.appService.getStation(+id);
    return { title: `Edytuj stację ${station.number}`, station, user };
  }

  // measurements
  @Get('measurements')
  @Render('pages/measurements/index')
  async measurements(@User() user: UserEntity) {
    const measurements = await this.appService.getMeasurements();
    return { title: 'Pomiary', measurements, user };
  }

  @Get('measurements/:id/edit')
  @Render('pages/measurements/edit')
  async editMeasurement(@Param('id') id: string, @User() user: UserEntity) {
    const measurement = await this.appService.getMeasurement(+id);
    return { title: `Edytuj pomiar o ID ${id}`, measurement, user };
  }

  // users
  @Get('users')
  @Render('pages/users/index')
  async users(@User() user: UserEntity) {
    const users = await this.appService.getUsers();
    return { title: 'Użytkownicy', users, user };
  }

  @Get('users/new')
  @Render('pages/users/new')
  addUser(@User() user: UserEntity) {
    return { title: 'Dodaj stację pomiarową', user };
  }

  @Get('profile')
  @Render('pages/users/profile')
  async profile(@User() user: UserEntity) {
    const profileUser = await this.appService.getUser(user.id);
    return { title: 'Edytuj profil', profileUser, user };
  }

  // download
  @Get('download/airly')
  @Render('pages/files/airly')
  downloadAirly(@User() user: UserEntity) {
    return { title: 'Pobieranie danych: Airly', user };
  }

  @Get('download/aqi')
  @Render('pages/files/aqi')
  downloadAqi(@User() user: UserEntity) {
    return { title: 'Pobieranie danych: AQI', user };
  }

  @Get('download/openweather')
  @Render('pages/files/openweather')
  downloadOpenweather(@User() user: UserEntity) {
    return { title: 'Pobieranie danych: OpenWeather', user };
  }

  // upload
  @Get('upload')
  @Render('pages/files/upload')
  upload(@User() user: UserEntity) {
    return { title: 'Import danych z karty SD', user };
  }

  // Wprowadź dane pomiarowe z pliku do bazy danych (jeżeli rozszerzenie to "txt")
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file.mimetype === 'text/plain') {
      const data = file.buffer + '';
      await this.appService.upload(data);
      return { error: false };
    }
    return { error: true };
  }

  // data-vis
  @Get('map')
  @Render('pages/data-vis/map')
  async map(@User() user: UserEntity, @Query() query?: string) {
    let measurements;
    if (query) {
      measurements = await this.appService.getMeasurementsByDate(query);
      return { title: 'Mapa zanieczyszczeń', measurements, user, query };
    } else {
      measurements = await this.appService.getMeasurementsByDate();
      return { title: 'Mapa zanieczyszczeń', measurements, user };
    }
  }

  @Get('map/dates')
  @Render('pages/stations/show')
  async mapDates(
    @Param('id') id: string,
    @Query() query: string,
    @User() user: UserEntity,
  ) {
    const station = await this.appService.getStation(+id);
    const chosenSeries = await this.appService.getSeries(+id, query);
    return {
      title: `Szczegóły stacji ${station.number}`,
      station,
      chosenSeries,
      user,
    };
  }

  @Get('route')
  @Render('pages/data-vis/route-index')
  async route(@User() user: UserEntity) {
    const stations = await this.appService.getStations();
    return { title: 'Trasa - wybór stacji', stations, user };
  }

  @Get('route/:id')
  @Render('pages/data-vis/route-show')
  async showRoute(@Param('id') id: string, @User() user: UserEntity) {
    const station = await this.appService.getStation(+id);
    return { title: `Trasa stacji ${station.number}`, station, user };
  }

  @Get('route/:id/series')
  @Render('pages/data-vis/route-show')
  async showRouteSeries(
    @Param('id') id: string,
    @Query() query: string,
    @User() user: UserEntity,
  ) {
    const station = await this.appService.getStation(+id);
    const chosenSeries = await this.appService.getSeries(+id, query);
    return {
      title: `Trasa stacji ${station.number}`,
      station,
      chosenSeries,
      user,
    };
  }
}
