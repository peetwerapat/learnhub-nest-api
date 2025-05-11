import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseHttpResponse } from 'src/common/http-response.type';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({
    description: 'User registration successful.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.CREATED,
      message: { en: 'User registration successful...', th: 'สร้างบัญชีผู้ใช้สำเร็จ...' },
    }),
  })
  @ApiConflictResponse({
    description: 'Email already exists.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.CONFLICT,
      message: { en: 'Email already exists...', th: 'อีเมลนี้มีอยู่แล้ว...' },
    }),
  })
  async create(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @Post('sign-in')
  @ApiCreatedResponse({
    description: 'Login successfully.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.CREATED,
      message: { en: 'Login successfully.', th: 'เข้าสู่ระบบสำเร็จ' },
    }),
  })
  @ApiBadRequestResponse({
    description: 'This email was not found in our system.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      message: {
        en: 'This email was not found in our system. Please register before using our services.',
        th: 'ไม่พบอีเมลนี้ในระบบ กรุณาสมัครสมาชิกก่อนใช้งาน',
      },
    }),
  })
  @ApiUnauthorizedResponse({
    description: 'Email or password is incorrect.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: { en: 'Email or password is incorrect.', th: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
    }),
  })
  async signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
}
