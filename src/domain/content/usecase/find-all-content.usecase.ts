import { Injectable } from '@nestjs/common';
import { FindAllQuery } from 'src/common/types/global.type';
import { HttpResponseType } from 'src/common/types/http-response.type';

import { ContentService } from '../content.service';
import { ContentDto } from '../dto';

@Injectable()
export class FindAllContentUsecase {
  constructor(private readonly _contentService: ContentService) {}

  async execute(query: FindAllQuery): Promise<HttpResponseType<ContentDto[]>> {
    return await this._contentService.findAll(query);
  }
}
