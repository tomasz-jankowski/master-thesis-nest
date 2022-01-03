import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // Funkcja uwierzytelniająca użytkownika
  async validateUser(login, pass): Promise<any> {
    // Jeżeli podany login to "root" - uwierzytelnij inną metodą, tj.
    //   - nie przeszukuj bazy danych
    //   - sprawdź, czy podane hasło zgadza się z hasłem wprowadzonym w zmiennej procesowej (podczas uruchamiania serwera)
    //   - zwróć użytkownika o logine i nazwie "root" oraz o pozytywnym statusie weryfikacji (patrz: user.entity.ts)
    if (login === 'root') {
      if (pass === process.env.ROOT_PASS) {
        const user = { login: 'root', name: 'root', isVerified: true };
        return user;
      }
    } else {
      // Znajdź użytkownika w bazie danych na podstawie pola "login"
      const user = await this.usersService.findOne(login);
      // Jeżeli:
      //   - użytkownik istnieje (został zwrócony rekord z bazy danych)
      //   - użytkownik jest zweryfikowany
      //   - funkcja "compare" biblioteki "bcrypt" poprawnie porówna podane hasło z tym zaszyfrowanym w bazie danych
      // to zwróć użytkownika z bazy danych.
      if (user && user.isVerified && (await compare(pass, user.password))) {
        const { password, ...result } = user;
        return result;
      }
    }
    // Jeżeli żaden z powyższych warunków nie jest spełniony, to zwróć "null"
    return null;
  }
}
