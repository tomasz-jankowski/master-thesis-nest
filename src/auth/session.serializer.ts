import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  // eslint-disable-next-line @typescript-eslint/ban-types
  serializeUser(user: any, done: Function): any {
    done(null, user);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  deserializeUser(payload: any, done: Function): any {
    done(null, payload);
  }
}
