import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(login, pass): Promise<any> {
    if (login === 'root') {
      if (pass === process.env.ROOT_PASS) {
        const user = { login: 'root', name: 'root', isVerified: true };
        return user;
      }
    } else {
      const user = await this.usersService.findOne(login);
      if (user && user.isVerified && (await compare(pass, user.password))) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }
}
