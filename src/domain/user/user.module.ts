import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity/user.entity';
import { FindOneUserByEmailUseCase, FindOneUserByIdUseCase } from './usecase';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, FindOneUserByIdUseCase, FindOneUserByEmailUseCase],
  controllers: [UserController],
  exports: [UserService, FindOneUserByIdUseCase, FindOneUserByEmailUseCase],
})
export class UserModule {}
