import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Request,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { LoginGuard } from './common/guards/login.guard';
import { AuthExceptionFilter } from './common/filters/auth-exception.filter';
import { Public } from './common/decorators/public.decorator';
import { User } from './common/decorators/user.decorator';
import { User as UserEntity } from './users/user.entity';
import { MeasurementsFilterDto } from './measurements/dto/measurements-filter.dto';

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
    if (req.user) return res.redirect('/');
    else
      return res.render('pages/login', {
        title: 'Logowanie',
        message: req.flash('loginError'),
      });
  }

  @Public()
  @UseGuards(LoginGuard)
  @Post('login')
  login(@Res() res: Response) {
    res.redirect('/');
  }

  @Public()
  @Get('register')
  register(@Request() req, @Res() res: Response) {
    if (req.user) return res.redirect('/');
    else return res.render('pages/register', { title: 'Rejestracja' });
  }

  @Get('logout')
  logout(@Request() req, @Res() res: Response) {
    req.logout();
    res.redirect('/login');
  }

  // stations
  @Get('stations')
  @Render('pages/stations/index')
  async stations(@User() user: UserEntity) {
    const stations = await this.appService.getStations();
    return { title: 'Stacje pomiarowe', stations, user };
  }

  // measurements
  @Get('measurements')
  @Render('pages/measurements/index')
  async measurements(@User() user: UserEntity) {
    const measurements = await this.appService.getMeasurements();
    const stations = await this.appService.getStations();
    return { title: 'Pomiary', measurements, stations, user };
  }

  // @Post('measurements')
  // @Render('pages/measurements/index')
  // async measurementsFiltered(
  //   @User() user: UserEntity,
  //   @Body() filterDto?: MeasurementsFilterDto,
  // ) {
  //   const measurements = await this.appService.getMeasurements(filterDto);
  //   const stations = await this.appService.getStations();
  //   return { title: 'Pomiary', measurements, stations, user };
  // }

  @Get('measurements/:id')
  @Render('pages/measurements/edit')
  async editMeasurement(@Param('id') id: string, @User() user: UserEntity) {
    const measurement = await this.appService.getMeasurement(+id);
    return { title: `Edytuj pomiar ${id}`, measurement, user };
  }
}
