import { Injectable } from '@nestjs/common';
import { HttpResponseType } from 'src/common/types/http-response.type';

import { ContentService } from '../content.service';
import { ContentDto } from '../dto';
import { UpdateContentDto } from '../dto/req/update-content.dto';

@Injectable()
export class UpdateContentUsecase {
  constructor(private readonly _contentService: ContentService) {}

  async execute(
    id: number,
    updateContentDto: UpdateContentDto,
    userId: number,
  ): Promise<HttpResponseType<ContentDto>> {
    return await this._contentService.updateContent(id, updateContentDto, userId);
  }
}
