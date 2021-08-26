import {
  Controller,
  Get,
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
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { AuthExceptionFilter } from './common/filters/auth-exception.filter';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  // auth
  @UseGuards(AuthenticatedGuard)
  @Get()
  @Render('pages/index')
  async index(@Request() req) {
    const stations = await this.appService.getStations();
    const measurements = await this.appService.getMeasurements();
    const users = await this.appService.getUsers();
    return {
      title: 'Strona główna',
      stations,
      measurements,
      users,
      user: req.user,
    };
  }

  @Get('login')
  loginPage(@Request() req, @Res() res: Response) {
    if (req.user) return res.redirect('/');
    else
      return res.render('pages/login', {
        title: 'Logowanie',
        message: req.flash('loginError'),
      });
  }

  @UseGuards(LoginGuard)
  @Post('login')
  login(@Res() res: Response) {
    res.redirect('/');
  }

  @Get('register')
  register(@Request() req, @Res() res: Response) {
    if (req.user) return res.redirect('/');
    else return res.render('pages/register', { title: 'Rejestracja' });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  logout(@Request() req, @Res() res: Response) {
    req.logout();
    res.redirect('/login');
  }

  // stations
}
