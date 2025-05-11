import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { HttpResponse } from 'src/common/http-response.type';

import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async fineOneByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      Logger.error(error);
      throw new Error('Error finding user by email');
    }
  }

  async findOneById(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      return user;
    } catch (error) {
      Logger.error(error);
      throw new Error('Error finding user by ID');
    }
  }

  async findMe(user: User) {
    return new HttpResponse({
      statusCode: 200,
      message: {
        th: 'ข้อมูลผู้ใช้',
        en: 'User data',
      },
      data: instanceToPlain(user),
    });
  }
}
