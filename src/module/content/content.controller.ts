import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { BaseHttpResponse, HttpResponseType } from 'src/common/types/http-response.type';
import { JwtAuthGuard } from 'src/lib/security/jwt/guard';

import { User } from '../user/entity/user.entity';

import { ContentService } from './content.service';
import { ContentDto, CreateContentDto } from './dto';

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
    @Request() req: ExpressRequest & { user: User },
    @Body() createContentDto: CreateContentDto,
  ) {
    createContentDto.userId = req.user.id;

    return this.contentService.create(createContentDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Find all contents success.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.OK,
      message: {
        en: 'Find all contents success.',
        th: 'ดึงข้อมูลคอนเทนต์ทั้งหมดสำเร็จ',
      },
    }),
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: String,
    example: 10,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ): Promise<HttpResponseType<ContentDto[]>> {
    return this.contentService.findAll({
      search,
      page: parseInt(page || '1'),
      pageSize: parseInt(pageSize || '10'),
      order,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Find content success.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.OK,
      message: {
        en: 'Find content success.',
        th: 'ดึงข้อมูลคอนเทนต์สำเร็จ',
      },
    }),
  })
  @ApiBadRequestResponse({
    description: 'Content not found.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      message: {
        en: 'Content not found.',
        th: 'ไม่พบคอนเทนต์ที่คุณร้องขอ',
      },
    }),
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponseType<ContentDto>> {
    return this.contentService.findOneByContentId(id);
  }
}
