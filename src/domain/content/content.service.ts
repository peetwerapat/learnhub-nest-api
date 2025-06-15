import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { OEmbedService } from 'src/common/oembed/oembed.service';
import { FindAllQuery } from 'src/common/types/global.type';
import { generatePagination, getPaginationValue } from 'src/common/utils/pagination';

import { BaseHttpResponse, HttpResponseType } from '../../common/types/http-response.type';
import { User } from '../user/entity/user.entity';

import { UpdateContentDto } from './dto/req/update-content.dto';
import { Content } from './entity/content.entity';
import { ContentDto, CreateContentDto } from './dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly _contentRepository: Repository<Content>,
    private readonly _oembedService: OEmbedService,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<HttpResponseType<ContentDto>> {
    const { userId, ...createContent } = createContentDto;
    const qr = this._contentRepository.manager.connection.createQueryRunner();

    try {
      await qr.connect();
      await qr.startTransaction();

      const user = await qr.manager.findOne(User, { where: { id: userId } });

      if (!user) {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: {
            en: 'Please login before create content.',
            th: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
          },
        });
      }

      if (createContent.rating < 0 || createContent.rating > 5) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: {
            en: 'Rating must be between 0 and 5.',
            th: 'กรุณาให้คะแนนระหว่าง 0 ถึง 5 เท่านั้น',
          },
        });
      }

      const { title, author_name, thumbnail_url } = await this._oembedService.getOEmbedInfo(
        createContentDto.videoUrl,
      );

      const newContent = qr.manager.create(Content, {
        ...createContent,
        videoTitle: title,
        creatorName: author_name,
        thumbnailUrl: thumbnail_url,
        user,
      });
      await qr.manager.save(newContent);

      await qr.commitTransaction();

      return {
        statusCode: HttpStatus.CREATED,
        message: {
          en: 'Create content success.',
          th: 'สร้างคอนเทนต์สำเร็จ',
        },
        data: {
          id: newContent.id,
          videoTitle: newContent.videoTitle,
          videoUrl: newContent.videoUrl,
          comment: newContent.comment,
          rating: newContent.rating,
          thumbnailUrl: newContent.thumbnailUrl,
          creatorName: newContent.creatorName,
          postedBy: user.firstName + ' ' + user.lastName,
          createdAt: newContent.createdAt,
          updatedAt: newContent.updatedAt,
        },
      };
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  async findAll({
    search,
    page,
    pageSize,
    order = 'DESC',
  }: FindAllQuery): Promise<HttpResponseType<ContentDto[]>> {
    const qb = this._contentRepository
      .createQueryBuilder('contents')
      .leftJoin('contents.user', 'user')
      .addSelect(['user.firstName', 'user.lastName']);

    const { skip, take } = getPaginationValue({ page, pageSize });

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.andWhere('LOWER(contents.videoTitle) LIKE LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [contents, totalCounts] = await qb
      .skip(skip)
      .take(take)
      .orderBy('contents.id', order === 'ASC' ? 'ASC' : 'DESC')
      .getManyAndCount();

    const contentDtos: ContentDto[] = contents.map((content) => ({
      id: content.id,
      videoTitle: content.videoTitle,
      videoUrl: content.videoUrl,
      comment: content.comment,
      rating: content.rating,
      thumbnailUrl: content.thumbnailUrl,
      creatorName: content.creatorName,
      postedBy: content.user ? `${content.user.firstName} ${content.user.lastName}` : '',
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    }));

    const pagination = generatePagination({ totalCounts, skip, take });

    return {
      statusCode: HttpStatus.OK,
      message: {
        en: 'Find all contents success.',
        th: 'ดึงข้อมูลคอนเทนต์ทั้งหมดสำเร็จ',
      },
      data: contentDtos,
      pagination,
    };
  }

  async findOneByContentId(contentId: number): Promise<HttpResponseType<ContentDto>> {
    const qb = this._contentRepository
      .createQueryBuilder('contents')
      .leftJoin('contents.user', 'user')
      .addSelect(['user.firstName', 'user.lastName']);

    const content = await qb.andWhere({ id: contentId }).getOne();

    if (!content) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: {
          en: 'Content not found.',
          th: 'ไม่พบคอนเทนต์ที่คุณร้องขอ',
        },
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: {
        en: 'Find content success.',
        th: 'ดึงข้อมูลคอนเทนต์สำเร็จ',
      },
      data: {
        id: content.id,
        videoTitle: content.videoTitle,
        videoUrl: content.videoUrl,
        comment: content.comment,
        rating: content.rating,
        thumbnailUrl: content.thumbnailUrl,
        creatorName: content.creatorName,
        postedBy: content.user ? `${content.user.firstName} ${content.user.lastName}` : '',
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
      },
    };
  }

  async updateContent(
    id: number,
    updateContentDto: UpdateContentDto,
    userId: number,
  ): Promise<HttpResponseType<ContentDto>> {
    const { comment, rating } = updateContentDto;

    const qr = this._contentRepository.manager.connection.createQueryRunner();

    try {
      await qr.connect();
      await qr.startTransaction();

      const content = await qr.manager.findOne(Content, { where: { id }, relations: ['user'] });

      if (!content) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: {
            en: 'Content not found.',
            th: 'ไม่พบคอนเทนต์ที่คุณร้องขอ',
          },
        });
      }

      if (content.user?.id !== userId) {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: {
            en: 'Not allowed to update this content',
            th: 'ผู้ใช้นี้ ไม่มีสิทธิ์อัพเดทข้อมูล',
          },
        });
      }

      if (comment !== undefined) {
        content.comment = comment;
      }
      if (rating !== undefined) {
        if (rating < 0 || rating > 5) {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: {
              en: 'Rating must be between 0 and 5',
              th: 'กรุณาให้คะแนนระหว่าง 0 ถึง 5 เท่านั้น',
            },
          });
        }
        content.rating = rating;
      }

      await qr.manager.update(Content, { id }, content);

      await qr.commitTransaction();

      return {
        statusCode: HttpStatus.OK,
        message: {
          en: 'Update content success.',
          th: 'อัพเดทข้อมูลคอนเทนต์สำเร็จ',
        },
        data: {
          id: content.id,
          videoTitle: content.videoTitle,
          videoUrl: content.videoUrl,
          comment: content.comment,
          rating: content.rating,
          thumbnailUrl: content.thumbnailUrl,
          creatorName: content.creatorName,
          postedBy: content.user ? `${content.user.firstName} ${content.user.lastName}` : '',
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
        },
      };
    } catch (error) {
      await qr.rollbackTransaction();

      throw error;
    } finally {
      await qr.release();
    }
  }

  async softDelete(id: number, userId: number): Promise<BaseHttpResponse> {
    const content = await this._contentRepository.findOne({ where: { id }, relations: ['user'] });

    if (!content) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: {
          en: 'Content not found.',
          th: 'ไม่พบคอนเทนต์ที่คุณร้องขอ',
        },
      });
    }

    if (content.user?.id !== userId) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: {
          en: 'Not allowed to delete this content',
          th: 'ผู้ใช้นี้ ไม่มีสิทธิ์ลบคอนเทนต์นี้',
        },
      });
    }

    await this._contentRepository.softRemove(content);

    return {
      statusCode: HttpStatus.OK,
      message: {
        en: 'Delete content success.',
        th: 'ลบคอนเทนต์สำเร็จ',
      },
    };
  }
}
