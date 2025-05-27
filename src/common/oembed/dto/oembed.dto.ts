import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class OEmBedDto {
  @ApiProperty()
  @IsString()
  author_name: string;

  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsUrl()
  thumbnail_url: string;

  @ApiProperty()
  @IsString()
  title: string;
}
