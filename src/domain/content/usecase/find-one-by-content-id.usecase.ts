import { Injectable } from '@nestjs/common';
import { HttpResponseType } from 'src/common/types/http-response.type';

import { ContentService } from '../content.service';
import { ContentDto } from '../dto';

@Injectable()
export class FindOneByContentIdUseCase {
  constructor(private readonly _contentService: ContentService) {}

  async execute(id: number): Promise<HttpResponseType<ContentDto>> {
    return await this._contentService.findOneByContentId(id);
  }
}
