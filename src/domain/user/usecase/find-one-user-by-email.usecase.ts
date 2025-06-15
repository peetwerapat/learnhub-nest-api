import { Injectable } from '@nestjs/common';

import { User } from '../entity/user.entity';
import { UserService } from '../user.service';

@Injectable()
export class FindOneUserByEmailUseCase {
  constructor(private readonly _userService: UserService) {}

  async execute(email: string): Promise<User | null> {
    return await this._userService.findOneByEmail(email);
  }
}
