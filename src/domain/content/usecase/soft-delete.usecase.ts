import { Injectable } from '@nestjs/common';
import { BaseHttpResponse } from 'src/common/types/http-response.type';

import { ContentService } from '../content.service';

@Injectable()
export class SoftDeleteContentUseCase {
  constructor(private readonly _contentService: ContentService) {}

  async execute(id: number, userId: number): Promise<BaseHttpResponse> {
    return await this._contentService.softDelete(id, userId);
  }
}
