import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { SignUpDto } from '../dto';

@Injectable()
export class SignUpUseCase {
  constructor(private readonly _authService: AuthService) {}

  async execute(signUpDto: SignUpDto) {
    return await this._authService.signUp(signUpDto);
  }
}
