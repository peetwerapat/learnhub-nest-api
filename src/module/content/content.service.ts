import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OEmbedService } from 'src/lib/oembed/oembed.service';

import { User } from '../user/entity/user.entity';

import { HttpResponseType } from './../../common/http-response.type';
import { Content } from './entity/content.entity';
import { ContentDto, CreateContentDto } from './dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    private readonly oembedService: OEmbedService,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<HttpResponseType<ContentDto>> {
    const { userId, ...createContent } = createContentDto;
    const qr = this.contentRepository.manager.connection.createQueryRunner();

    try {
      await qr.connect();
      await qr.startTransaction();

      const user = await qr.manager.findOne(User, { where: { id: userId } });

      if (!user) {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: {
            th: 'กรุณาเข้่าสู่ระบบก่อนใช้งาน',
            en: 'Please login before create content.',
          },
        });
      }

      const { title, author_name, thumbnail_url } = await this.oembedService.getOEmbedInfo(
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
          postedBy: user.email,
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
}
