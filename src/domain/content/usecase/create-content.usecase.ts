import { Injectable } from '@nestjs/common';
import { HttpResponseType } from 'src/common/types/http-response.type';

import { ContentService } from '../content.service';
import { ContentDto, CreateContentDto } from '../dto';

@Injectable()
export class CreateContentUsecase {
  constructor(private readonly _contentService: ContentService) {}

  async execute(createContentDto: CreateContentDto): Promise<HttpResponseType<ContentDto>> {
    return await this._contentService.create(createContentDto);
  }
}
