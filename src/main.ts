import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import * as flash from 'connect-flash';
import * as bodyParser from 'body-parser';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);

  // Przesunięcie adresu o przedrostek "powietrze"
  app.setGlobalPrefix('powietrze');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalGuards(new AuthenticatedGuard(reflector));

  // Określenie katalogów kolejno dla zasobów publicznych (np. pliki CSS, JS) oraz widoków (szablonów HTML)
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // Określenie "silnika renderowania", tj. silnika wprowadzającego dynamiczne dane i renderującego statyczną stronę HTML
  // Używany silnik: Pug.js [https://pugjs.org/api/getting-started.html]
  app.setViewEngine('pug');

  // Inicjalizacja sesji użytkownika (część systemu logowania)
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 1000000,
    }),
  );

  // Inicjalizacja biblioteki uwierzytelniania (część systemu logowania)
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  // Uruchomienie serwera na porcie podanym jako zmienna procesowa (w przypadku jej braku na porcie 3000)
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
