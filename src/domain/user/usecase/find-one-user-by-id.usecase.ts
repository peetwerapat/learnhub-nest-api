import { Injectable } from '@nestjs/common';

import { User } from '../entity/user.entity';
import { UserService } from '../user.service';

@Injectable()
export class FindOneUserByIdUseCase {
  constructor(private readonly _userService: UserService) {}

  async execute(id: number): Promise<User | null> {
    return await this._userService.findOneById(id);
  }
}
