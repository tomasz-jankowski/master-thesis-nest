import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import * as flash from 'connect-flash';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalGuards(new AuthenticatedGuard(reflector));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(3000);
}
bootstrap();
