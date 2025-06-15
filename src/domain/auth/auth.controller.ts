import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseHttpResponse } from 'src/common/types/http-response.type';

import { SignInDto, SignUpDto } from './dto';
import { SignInUseCase, SignUpUseCase } from './usecase';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _signUpUsecase: SignUpUseCase,
    private readonly _signInUsecase: SignInUseCase,
  ) {}

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
  async create(@Body() signUpDto: SignUpDto) {
    return this._signUpUsecase.execute(signUpDto);
  }

  @Post('sign-in')
  @ApiOkResponse({
    description: 'Login successfully.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.OK,
      message: { en: 'Login successfully.', th: 'เข้าสู่ระบบสำเร็จ' },
    }),
  })
  @ApiNotFoundResponse({
    description: 'This email was not found in our system.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.NOT_FOUND,
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
  async signIn(@Body() signInDto: SignInDto) {
    return this._signInUsecase.execute(signInDto);
  }
}
