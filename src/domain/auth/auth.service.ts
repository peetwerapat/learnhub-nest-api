import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EncryptionService } from 'src/common/security/encryption';
import { JwtPayloadModel, JwtService } from 'src/common/security/jwt';
import { BaseHttpResponse, HttpResponse } from 'src/common/types/http-response.type';

import { User } from '../user/entity/user.entity';

import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<BaseHttpResponse> {
    try {
      const { email, password } = signUpDto;

      const userExists = await this.userRepository.findOne({
        where: { email },
      });
      if (userExists) {
        throw new ConflictException(
          new BaseHttpResponse({
            statusCode: HttpStatus.CONFLICT,
            message: {
              en: 'Email already exists...',
              th: 'อีเมลนี้มีอยู่แล้ว...',
            },
          }),
        );
      }

      const hashPassword = await EncryptionService.hashPassword(password);
      const user = this.userRepository.create({
        ...signUpDto,
        password: hashPassword,
      });
      await this.userRepository.save(user);

      return new BaseHttpResponse({
        statusCode: HttpStatus.CREATED,
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

  async signIn(signInDto: SignInDto) {
    try {
      const { email, password } = signInDto;

      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: {
            en: 'This email was not found in our system. Please register before using our services.',
            th: 'ไม่พบอีเมลนี้ในระบบ กรุณาสมัครสมาชิกก่อนใช้งาน',
          },
        });
      }

      const isPasswordMatch = await EncryptionService.validatePassword(password, user.password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: {
            en: 'Email or password is incorrect.',
            th: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
          },
        });
      }

      const payload: JwtPayloadModel = {
        id: user.id,
      };

      const token = this.jwtService.generateJwt(payload);

      return new HttpResponse({
        statusCode: HttpStatus.OK,
        message: { en: 'Login successfully.', th: 'เข้าสู่ระบบสำเร็จ' },
        data: token,
      });
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
