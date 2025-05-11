import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from 'src/lib/security/jwt';

import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuardName } from './constants';
import { JwtAuthStrategy } from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    PassportModule.register({ defaultStrategy: [JwtAuthGuardName] }),
    JwtModule,
  ],
  providers: [UserService, AuthService, JwtAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
