import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('dashboard/pages/index')
  async index() {
    const stations = await this.appService.getStations();
    const users = await this.appService.getUsers();
    return { title: 'Strona główna', stations, users };
  }
}
