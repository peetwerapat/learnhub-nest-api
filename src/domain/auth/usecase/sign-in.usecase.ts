import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { SignInDto } from '../dto';

@Injectable()
export class SignInUseCase {
  constructor(private readonly _authService: AuthService) {}

  async execute(signInDto: SignInDto) {
    return await this._authService.signIn(signInDto);
  }
}
