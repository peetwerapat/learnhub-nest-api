import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseHttpResponse, HttpResponse } from 'src/common/http-response.type';
import { EncryptionService } from 'src/lib/security/encryption';
import { JwtPayloadModel, JwtService } from 'src/lib/security/jwt';

import { User } from '../user/entity/user.entity';

import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authDto: AuthDto): Promise<BaseHttpResponse> {
    try {
      const { email, password } = authDto;

      const userExists = await this.userRepository.findOne({
        where: { email },
      });
      if (userExists) {
        throw new ConflictException(
          new BaseHttpResponse({
            statusCode: 409,
            message: {
              en: 'Email already exists...',
              th: 'อีเมลนี้มีอยู่แล้ว...',
            },
          }),
        );
      }

      const hashPassword = await EncryptionService.hashPassword(password);
      const user = this.userRepository.create({
        ...authDto,
        password: hashPassword,
      });
      await this.userRepository.save(user);

      return new BaseHttpResponse({
        statusCode: 201,
        message: {
          en: 'User registration successful...',
          th: 'สร้างบัญชีผู้ใช้สำเร็จ...',
        },
      });
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async signIn(authDto: AuthDto) {
    try {
      const { email, password } = authDto;

      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new BadRequestException({
          statusCode: 400,
          message: {
            th: 'ไม่พบอีเมลนี้ในระบบ กรุณาสมัครสมาชิกก่อนใช้งาน',
            en: 'This email was not found in our system. Please register before using our services.',
          },
        });
      }

      const isPasswordMatch = await EncryptionService.validatePassword(password, user.password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: {
            th: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
            en: 'Email or password is incorrect.',
          },
        });
      }

      const payload: JwtPayloadModel = {
        id: user.id,
      };

      const token = this.jwtService.generateJwt(payload);

      return new HttpResponse({
        statusCode: 200,
        message: { th: 'เข้าสู่ระบบสำเร็จ', en: 'Login successfully.' },
        data: token,
      });
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
