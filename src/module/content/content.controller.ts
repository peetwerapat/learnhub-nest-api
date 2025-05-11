import { Body, Controller, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { BaseHttpResponse } from 'src/common/http-response.type';
import { JwtAuthGuard } from 'src/lib/security/jwt/guard';

import { ContentService } from './content.service';
import { CreateContentDto } from './dto';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiCreatedResponse({
    description: 'Create content success.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.CREATED,
      message: {
        en: 'Create content success.',
        th: 'สร้างคอนเทนต์สำเร็จ',
      },
    }),
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before create content.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: { en: 'Please login before create content.', th: 'กรุณาเข้่าสู่ระบบก่อนใช้งาน' },
    }),
  })
  async create(
    @Request() req: ExpressRequest & { userId: number },
    @Body() createContentDto: CreateContentDto,
  ) {
    createContentDto.userId = req.userId;

    return this.contentService.create(createContentDto);
  }
}
