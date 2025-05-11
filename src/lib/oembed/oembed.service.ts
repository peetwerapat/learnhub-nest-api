import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import { OEmBedDto, OEmbedErrorDto } from './dto';

const isError = (data: OEmBedDto | OEmbedErrorDto): data is OEmbedErrorDto =>
  Object.prototype.hasOwnProperty.call(data, 'error');

@Injectable()
export class OEmbedService {
  async getOEmbedInfo(videoUrl: string): Promise<OEmBedDto> {
    try {
      const res = await axios.get<OEmBedDto | OEmbedErrorDto>(
        `https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`,
      );

      const oembedData = res.data;
      if (isError(oembedData)) {
        throw new HttpException('Invalid video URL', HttpStatus.BAD_REQUEST);
      }

      const { author_name, url, thumbnail_url, title } = oembedData;
      return { author_name, url, thumbnail_url, title };
    } catch (err) {
      Logger.error(err);
      throw new HttpException('Failed to fetch oEmbed data', HttpStatus.BAD_GATEWAY);
    }
  }
}
