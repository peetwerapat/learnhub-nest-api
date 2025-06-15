import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from 'src/common/security/jwt/guard';
import { BaseHttpResponse, HttpResponseType } from 'src/common/types/http-response.type';

import { User } from '../user/entity/user.entity';

import { UpdateContentDto } from './dto/req/update-content.dto';
import { UpdateContentUsecase } from './usecase/update-content.usecase';
import { ContentDto, CreateContentDto } from './dto';
import {
  CreateContentUsecase,
  FindAllContentUsecase,
  FindOneByContentIdUseCase,
  SoftDeleteContentUseCase,
} from './usecase';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(
    private readonly _createContentUsecase: CreateContentUsecase,
    private readonly _findAllContentUsecase: FindAllContentUsecase,
    private readonly _fintOneByContentIdUsecase: FindOneByContentIdUseCase,
    private readonly _updateContentUsecase: UpdateContentUsecase,
    private readonly _softDeleteContentUsecase: SoftDeleteContentUseCase,
  ) {}

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
      message: { en: 'Please login before create content.', th: 'กรุณาเข้าสู่ระบบก่อนใช้งาน' },
    }),
  })
  @ApiBadRequestResponse({
    description: 'Rating must be between 0 and 5.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      message: {
        en: 'Rating must be between 0 and 5.',
        th: 'กรุณาให้คะแนนระหว่าง 0 ถึง 5 เท่านั้น',
      },
    }),
  })
  async create(
    @Request() req: ExpressRequest & { user: User },
    @Body() createContentDto: CreateContentDto,
  ) {
    createContentDto.userId = req.user.id;

    return this._createContentUsecase.execute(createContentDto);
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
    return this._findAllContentUsecase.execute({
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
  @ApiNotFoundResponse({
    description: 'Content not found.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.NOT_FOUND,
      message: {
        en: 'Content not found.',
        th: 'ไม่พบคอนเทนต์ที่คุณร้องขอ',
      },
    }),
  })
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<HttpResponseType<ContentDto>> {
    return this._fintOneByContentIdUsecase.execute(+id);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiCreatedResponse({
    description: 'Update content success.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.OK,
      message: {
        en: 'Update content success.',
        th: 'อัพเดทข้อมูลคอนเทนต์สำเร็จ',
      },
    }),
  })
  @ApiNotFoundResponse({
    description: 'Content not found.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.NOT_FOUND,
      message: {
        en: 'Content not found.',
        th: 'ไม่พบคอนเทนต์ที่คุณร้องขอ',
      },
    }),
  })
  @ApiUnauthorizedResponse({
    description: 'Not allowed to update this content',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: {
        en: 'Not allowed to update this content',
        th: 'ผู้ใช้นี้ ไม่มีสิทธิ์อัพเดทข้อมูล',
      },
    }),
  })
  @ApiBadRequestResponse({
    description: 'Rating must be between 0 and 5.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      message: {
        en: 'Rating must be between 0 and 5.',
        th: 'กรุณาให้คะแนนระหว่าง 0 ถึง 5 เท่านั้น',
      },
    }),
  })
  async update(
    @Request() req: ExpressRequest & { user: User },
    @Param('id', ParseIntPipe) id: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    const userId = req.user.id;

    return this._updateContentUsecase.execute(+id, updateContentDto, userId);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Delete content success.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.OK,
      message: {
        en: 'Delete content success.',
        th: 'ลบคอนเทนต์สำเร็จ',
      },
    }),
  })
  @ApiNotFoundResponse({
    description: 'Content not found.',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.NOT_FOUND,
      message: {
        en: 'Content not found.',
        th: 'ไม่พบคอนเทนต์ที่คุณร้องขอ',
      },
    }),
  })
  @ApiUnauthorizedResponse({
    description: 'Not allowed to update this content',
    example: new BaseHttpResponse({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: {
        en: 'Not allowed to update this content',
        th: 'ผู้ใช้นี้ ไม่มีสิทธิ์อัพเดทข้อมูล',
      },
    }),
  })
  async softDelete(
    @Request() req: ExpressRequest & { user: User },
    @Param('id', ParseIntPipe) id: string,
  ) {
    const userId = req.user.id;

    return this._softDeleteContentUsecase.execute(+id, userId);
  }
}
