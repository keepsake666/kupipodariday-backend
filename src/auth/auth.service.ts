import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  auth(user) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload, { expiresIn: '3d' }) };
  }
  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    const passwordEquals = await bcrypt.compare(password, user.password);
    if (user && passwordEquals) {
      /* Исключаем пароль из результата */
      const { password, ...result } = user;

      return user;
    }

    return null;
  }
}
