import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return 'I am servie signup';
  }

  login() {
    return 'I am service login';
  }
}
