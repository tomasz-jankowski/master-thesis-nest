import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // Wskazanie pola z bazy danych na podstawie którego ma być przeprowadzona weryfikacja
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string) {
    // Wywołanie funkcji z serwisu "auth.service.ts" i przypisanie jej wyniku do zmiennej "user"
    const user = await this.authService.validateUser(login, password);
    // Jeżeli użytkownik nie istnieje (wartość zwrócona to "null") to wyrzuć wyjątek braku autoryzacji
    if (!user) {
      throw new UnauthorizedException();
    }
    // Zwróć zmienną "user"
    return user;
  }
}
